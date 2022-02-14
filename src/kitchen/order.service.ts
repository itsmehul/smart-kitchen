import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { EVENTS } from 'src/common/common.constants';
import { ArithmeticOperator } from 'src/common/common.interfaces';
import { BowlService } from 'src/delivery/bowl.service';
import { BoxService } from 'src/delivery/box.service';
import { DeliveryService } from 'src/delivery/delivery.service';
import { Box } from 'src/delivery/entities/box.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { TaskType } from 'src/scheduledtask/entities/scheduledtask.entity';
import { ScheduledtaskService } from 'src/scheduledtask/scheduledtask.service';
import {
  entitiesToSave,
  handleErrorResponse,
  removeTimeFromDate,
} from 'src/utils/misc';
import { getManager, In, Repository } from 'typeorm';
import { OrderActionType } from './dtos/lane.dto';
import {
  CancelOrderInput,
  CreateOrderInput,
  PackOrdersInput,
  PackOrderViaBowlInput,
  UpdateOrderStatusInput,
} from './dtos/order.dto';
import { Order, OrderStatus } from './entities/Order.entity';
import { LaneService } from './lane.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly order: Repository<Order>,
    private readonly laneService: LaneService,
    private readonly deliveryService: DeliveryService,
    private readonly scheduletaskService: ScheduledtaskService,
    private readonly boxService: BoxService,
    private readonly bowlService: BowlService,
    private readonly inventoryService: InventoryService,
    private schedulerRegistry: SchedulerRegistry,
    private eventEmitter: EventEmitter2,
  ) {}

  async updateStatus(input: UpdateOrderStatusInput): Promise<any> {
    try {
      await this.order.update(
        {
          id: In(input.orderIds),
        },
        { status: input.status },
      );
    } catch (error) {
      console.log('');
    }
  }

  async packOrders(
    input: PackOrdersInput,
    kitchenId: string,
  ): Promise<Box[][]> {
    try {
      await this.order.update(
        {
          id: In(input.orderIds),
        },
        { status: OrderStatus.PACKED },
      );
      return this.boxService.getAllOrdersReadyForDelivery(kitchenId);
    } catch (error) {
      console.log('');
    }
  }

  async packOrdersViaBowl(
    input: PackOrderViaBowlInput,
    kitchenId: string,
  ): Promise<Box[][]> {
    try {
      const emptyBowl = await this.bowlService.getBowlIfEmpty(input.bowlId);
      if (!emptyBowl) {
        throw 'Bowl already used';
      }
      await this.order.update(
        {
          id: input.orderId,
          bowl: {
            id: input.bowlId,
          },
        },
        { status: OrderStatus.PACKED },
      );
      return this.boxService.getAllOrdersReadyForDelivery(kitchenId);
    } catch (error) {
      console.log('');
    }
  }

  async createOrder({ qty, ...input }: CreateOrderInput): Promise<any> {
    try {
      // if (
      //   DateTime.fromJSDate(input.delivery.deliveryDateTime).diffNow('hours')
      //     .hours < 2
      // ) {
      //   throw 'The order window has closed for this order. Please order hours before delivery';
      // }

      const lane = await this.laneService.updateOrderedQtyToLane({
        action: OrderActionType.ADD,
        orderedQty: qty,
        recipeId: input.recipeId,
        serviceDate: removeTimeFromDate(input.delivery.deliveryDateTime),
      });

      const orders = [];

      for (let i = 0; i < qty; i++) {
        orders.push(
          this.order.create({
            ...input,
            delivery: this.deliveryService.createDeliveryEntity(input.delivery),
            kitchen: { id: input.kitchenId },
            recipe: { id: input.recipeId },
          }),
        );
      }

      const { allInventoriesAffected, possibleStock } =
        await this.inventoryService.updateStockForRecipe(
          input.recipeId,
          qty,
          input.kitchenId,
          ArithmeticOperator.SUBTRACT,
        );

      const cronName = input.delivery.deliveryDateTime.toISOString();

      let jobExists = false;

      const jobs = this.schedulerRegistry.getCronJobs();
      for (const [key] of jobs) {
        const minuteDifference = DateTime.fromISO(key).diff(
          DateTime.fromJSDate(input.delivery.deliveryDateTime),
          'minutes',
        ).minutes;
        jobExists = minuteDifference < 20 && minuteDifference >= 0;

        if (jobExists) {
          break;
        }
      }

      if (!jobExists) {
        await this.scheduletaskService.createScheduledTask(
          cronName,
          input.delivery.deliveryDateTime,
          TaskType.BOX,
          { kitchenId: input.kitchenId },
          async (data: any) => {
            const boxedOrders = await this.boxService.initiateBoxing(
              data.kitchenId,
            );
            await entitiesToSave([boxedOrders]);
          },
        );
      }

      await entitiesToSave([lane, orders, allInventoriesAffected]);

      this.eventEmitter.emit(EVENTS.UPDATED_STOCK, {
        possibleStock,
        recipeId: input.recipeId,
      });

      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }

  async cancelOrder(input: CancelOrderInput): Promise<any> {
    try {
      const foundOrders = await this.order.find({
        where: {
          orderId: input.orderId,
        },
        relations: ['delivery'],
      });

      if (!foundOrders.length) {
        throw 'Order not found';
      }

      const lane = await this.laneService.updateOrderedQtyToLane({
        action: OrderActionType.REMOVE,
        orderedQty: foundOrders.length,
        recipeId: foundOrders[0].recipeId,
        serviceDate: removeTimeFromDate(
          foundOrders[0].delivery.deliveryDateTime,
        ),
      });

      const { allInventoriesAffected, possibleStock } =
        await this.inventoryService.updateStockForRecipe(
          foundOrders[0].recipeId,
          foundOrders.length,
          foundOrders[0].kitchenId,
          ArithmeticOperator.ADD,
        );

      await getManager().transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(lane);
          await transactionalEntityManager.save(allInventoriesAffected);
          await transactionalEntityManager.remove(foundOrders);
        },
      );

      this.eventEmitter.emit(EVENTS.UPDATED_STOCK, {
        possibleStock,
        recipeId: foundOrders[0].recipeId,
      });

      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }
}

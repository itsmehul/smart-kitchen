import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import { EVENTS } from 'src/common/common.constants';
import { BoxService } from 'src/delivery/box.service';
import { DeliveryService } from 'src/delivery/delivery.service';
import { TaskType } from 'src/scheduledtask/entities/scheduledtask.entity';
import { ScheduledtaskService } from 'src/scheduledtask/scheduledtask.service';
import {
  entitiesToSave,
  handleErrorResponse,
  removeTimeFromDate,
} from 'src/utils/misc';
import { getManager, Repository } from 'typeorm';
import { OrderActionType } from './dtos/lane.dto';
import { CancelOrderInput, CreateOrderInput } from './dtos/order.dto';
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
    private schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

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

      await entitiesToSave([lane, orders]);

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
        this.scheduletaskService.createScheduledTask(
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

      this.eventEmitter.emit(EVENTS.PLACE_ORDER, {
        recipeId: input.recipeId,
        orderedQty: qty,
        kitchenId: input.kitchenId,
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

      for (const foundOrder of foundOrders) {
        foundOrder.orderId = null;
        foundOrder.delivery = null;
        foundOrder.status = OrderStatus.cancelled;
      }

      await getManager().transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(lane);
          await transactionalEntityManager.delete(Order, foundOrders);
        },
      );

      this.eventEmitter.emit(EVENTS.CANCEL_ORDER, {
        recipeId: foundOrders[0].recipeId,
        orderedQty: foundOrders.length,
        kitchenId: foundOrders[0].kitchenId,
      });

      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { EVENTS } from 'src/common/common.constants';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Between, In, Not, Repository } from 'typeorm';
import {
  CancelOrderInput,
  CreateOrderInput,
  ShiftOrderInput,
} from './dtos/order.dto';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/kitchen.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Kitchen) private readonly kitchen: Repository<Kitchen>,
    @InjectRepository(Order) private readonly order: Repository<Order>,
    @InjectRepository(Forecast) private readonly forecast: Repository<Forecast>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createForecastedOrder(): Promise<CoreOutput> {
    return { ok: true };
  }

  async createOrder({ qty, ...input }: CreateOrderInput): Promise<CoreOutput> {
    const foundVacantForecastOrders = await this.order.find({
      where: {
        recipe: {
          id: input.recipeId,
        },
      },
    });
    if (foundVacantForecastOrders?.length > qty) {
      for (let i = 0; i < qty; i++) {
        foundVacantForecastOrders[i].orderId = input.orderId;
      }
      await this.order.save(foundVacantForecastOrders);
    } else {
      const orders = [];
      for (let i = 0; i < qty; i++) {
        orders.push(input);
      }
      await this.order.save(orders);
    }
    return { ok: true };
  }

  async shiftOrder(input: ShiftOrderInput) {
    const allFoundOrders = await this.order.find({
      where: { name: In(input.kitchenOrderIds) },
    });
    for (const foundOrder of allFoundOrders) {
      foundOrder.status = input.direction;
    }
    await this.order.save(allFoundOrders);

    if (input.direction === OrderStatus.inCompleted) {
      const foundIncompleteOrder = await this.order.findOne({
        where: {
          status: Not(OrderStatus.inCompleted),
          delivery: {
            external_id: allFoundOrders[0].delivery.external_id,
            deliveryDateTime: Between(
              dayjs.utc().startOf('day').toISOString(),
              dayjs.utc().endOf('day').toISOString(),
            ),
          },
        },
        relations: ['delivery'],
      });
      if (foundIncompleteOrder) {
        return;
      }
      // Call box API to get the package
      // Use event emitter to notify the kitchen

      const foundCompletedOrders = await this.order.findOne({
        where: {
          status: OrderStatus.inCompleted,
          delivery: {
            external_id: allFoundOrders[0].delivery.external_id,
            deliveryDateTime: Between(
              dayjs.utc().startOf('day').toISOString(),
              dayjs.utc().endOf('day').toISOString(),
            ),
          },
        },
        relations: ['recipe', 'delivery'],
      });

      this.eventEmitter.emit(EVENTS.ORDER_COMPLETED_FOR_GROUP, {
        orders: foundCompletedOrders,
      });
    }

    return { ok: true };
  }

  async cancelOrder(input: CancelOrderInput): Promise<CoreOutput> {
    const foundOrders = await this.order.find({
      where: {
        orderId: input.orderId,
      },
    });
    if (foundOrders) {
      for (const foundOrder of foundOrders) {
        if (
          foundOrder.status === OrderStatus.inKitchen ||
          foundOrder.status === OrderStatus.inProcessing
        ) {
          throw new Error('Order cannot be cancelled now');
        }

        foundOrder.orderId = null;
        foundOrder.delivery = null;
      }
      await this.order.save(foundOrders);
    }
    return { ok: true };
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { EVENTS } from 'src/common/common.constants';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { handleErrorResponse } from 'src/utils/misc';
import { Between, In, IsNull, Not, Repository } from 'typeorm';
import { Storage } from '../inventory/entities/storage.entity';
import { CreateForecastInput, ForecastsOutput } from './dtos/forecast.dto';
import { CreateKitchenInput, CreateKitchenOutput } from './dtos/Kitchen.dto';
import {
  CancelOrderInput,
  CreateOrderInput,
  ShiftOrderInput,
} from './dtos/order.dto';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/kitchen.entity';
import {
  MOVEMENT_DIRECTION,
  Order,
  OrderStatus,
} from './entities/order.entity';

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Kitchen) private readonly kitchen: Repository<Kitchen>,
    @InjectRepository(Order) private readonly order: Repository<Order>,
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
    @InjectRepository(Forecast) private readonly forecast: Repository<Forecast>,
    @InjectRepository(Delivery) private readonly delivery: Repository<Delivery>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getForecasts(): Promise<ForecastsOutput> {
    const forecasts = await this.forecast.find({
      where: {
        kitchen: {
          id: 'a23a9685-f60c-4705-9503-5c4f9e21de64',
        },
      },
      relations: ['kitchen', 'recipe'],
    });

    return {
      ok: true,
      forecasts,
    };
  }

  async createForecastedOrder(input: CreateForecastInput): Promise<CoreOutput> {
    try {
      if (DateTime.fromJSDate(input.serviceDate) < DateTime.now()) {
        throw 'Service date must be in the future';
      }

      const orders = [];

      for (let i = 0; i < input.originalQty; i++) {
        orders.push(
          this.order.create({
            kitchen: { id: input.kitchenId },
            recipe: { id: input.recipeId },
          }),
        );
      }

      await this.forecast.save(
        this.forecast.create({
          ...input,
          kitchen: { id: input.kitchenId },
          recipe: { id: input.recipeId },
        }),
      );

      await this.order.save(orders);
      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create forecasted order');
    }
  }

  async createKitchen(input: CreateKitchenInput): Promise<CreateKitchenOutput> {
    if (input.storages) {
      input.storages = input.storages.map((storage) =>
        this.storage.create(storage),
      );
    }
    const kitchen = await this.kitchen.save(input);
    return { ok: true, kitchen };
  }

  async createOrder({ qty, ...input }: CreateOrderInput): Promise<CoreOutput> {
    try {
      const foundVacantForecastOrders = await this.order.find({
        where: {
          recipe: {
            id: input.recipeId,
          },
          delivery: IsNull(),
        },
      });

      if (
        DateTime.fromJSDate(input.delivery.deliveryDateTime).diffNow('hours')
          .hours < 2
      ) {
        throw 'The order window has closed for this order. Please order hours before delivery';
      }

      let nonForecastedQty = 0;
      let forecastedQty = 0;

      if (foundVacantForecastOrders.length >= qty) {
        forecastedQty = qty;
      } else {
        nonForecastedQty = qty - foundVacantForecastOrders.length;
        forecastedQty = foundVacantForecastOrders.length;
      }

      const orders = [];

      for (let i = 0; i < forecastedQty; i++) {
        orders.push(
          this.order.create({
            ...foundVacantForecastOrders[i],
            ...input,
            delivery: this.delivery.create(input.delivery),
          }),
        );
      }

      for (let i = 0; i < nonForecastedQty; i++) {
        orders.push(
          this.order.create({
            ...input,
            delivery: this.delivery.create(input.delivery),
            kitchen: { id: input.kitchenId },
            recipe: { id: input.recipeId },
          }),
        );
      }
      await this.order.save(orders);

      // const realOrder = orders.find((order) => order.delivery && );

      // if (nextStatus === OrderStatus.inCompleted && realOrder) {
      //   this.checkIfOrderIsReadyForBoxing(allFoundOrders[0]);
      // }

      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }

  async promoteOrders(input: ShiftOrderInput) {
    const allFoundOrders = await this.order.find({
      where: {
        id: In(input.kitchenOrderIds),
      },
      relations: ['delivery', 'recipe', 'kitchen'],
    });

    if (allFoundOrders.length === 0) {
      throw 'No orders found';
    }

    const nextStatus =
      MOVEMENT_DIRECTION[
        MOVEMENT_DIRECTION.findIndex(
          (status) => status === allFoundOrders[0].status,
        ) + 1
      ];

    for (const foundOrder of allFoundOrders) {
      foundOrder.status = nextStatus;
    }
    await this.order.save(allFoundOrders);

    // When the order is moved to processing, we reduce the stock for the ingredients used
    if (nextStatus === OrderStatus.inProcessing) {
      this.eventEmitter.emit(EVENTS.ORDERS_IN_PROCESSING, {
        recipeId: allFoundOrders[0].recipeId,
        orderedQty: allFoundOrders.length,
        kitchenId: allFoundOrders[0].kitchenId,
      });
    }

    // If the order is complete for the given external id it is issued for boxing
    if (nextStatus === OrderStatus.inCompleted && allFoundOrders[0].delivery) {
      this.checkIfOrderIsReadyForBoxing(allFoundOrders[0]);
    }

    return { ok: true };
  }

  async checkIfOrderIsReadyForBoxing(order: Order) {
    const foundIncompleteOrder = await this.order.findOne({
      where: {
        status: Not(OrderStatus.inCompleted),
        delivery: {
          external_id: order.delivery.external_id,
          deliveryDateTime: Between(
            DateTime.now().startOf('day').toString(),
            DateTime.now().endOf('day').toString(),
          ),
        },
      },
      relations: ['delivery'],
    });
    if (foundIncompleteOrder) {
      return;
    }
    const foundCompletedOrders = await this.order.findOne({
      where: {
        status: OrderStatus.inCompleted,
        delivery: {
          external_id: order.delivery.external_id,
          deliveryDateTime: Between(
            DateTime.now().startOf('day').toString(),
            DateTime.now().endOf('day').toString(),
          ),
        },
      },
      relations: ['recipe', 'delivery'],
    });

    this.eventEmitter.emit(EVENTS.ORDER_COMPLETED_FOR_GROUP, {
      orders: foundCompletedOrders,
    });
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

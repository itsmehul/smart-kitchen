import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Order, OrderStatus } from 'src/kitchen/entities/order.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { CreateDeliveryInput } from './dto/delivery.dto';
import { Delivery } from './entities/delivery.entity';
import * as R from 'ramda';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) private readonly delivery: Repository<Delivery>,
    @InjectRepository(Order) private readonly order: Repository<Order>,
  ) {}

  createDeliveryEntity(input: CreateDeliveryInput): Delivery {
    return this.delivery.create(input);
  }

  async getAllOrdersReadyForDelivery(kitchenId: string): Promise<any> {
    const orders = await this.order.find({
      where: {
        // status: OrderStatus.inCompleted,
        box: Not(IsNull()),
        kitchen: {
          id: kitchenId,
        },
        // delivery: {
        //   deliveryDateTime: Between(
        //     DateTime.now().plus({ minute: 105 }).toJSDate(),
        //     DateTime.now().plus({ hour: 2 }).toJSDate(),
        //   ),
        // },
      },
      relations: ['delivery', 'recipe', 'box'],
    });

    console.log('orde', orders);
  }
}

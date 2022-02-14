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
}

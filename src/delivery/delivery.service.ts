import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/kitchen/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryInput } from './dto/delivery.dto';
import { Delivery } from './entities/delivery.entity';

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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) private readonly delivery: Repository<Delivery>,
  ) {}

  async createDelivery(input: any): Promise<any> {
    // this.delivery.save({
    // })
  }
}

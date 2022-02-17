import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from '../inventory/entities/storage.entity';
import { CreateKitchenInput, CreateKitchenOutput } from './dtos/Kitchen.dto';
import { Kitchen } from './entities/kitchen.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Kitchen) private readonly kitchen: Repository<Kitchen>,
    @InjectRepository(Order) private readonly order: Repository<Order>,
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createKitchen(input: CreateKitchenInput): Promise<CreateKitchenOutput> {
    if (input.storages) {
      input.storages = input.storages.map((storage) =>
        this.storage.create(storage),
      );
    }
    const kitchen = await this.kitchen.save(input);
    return { ok: true, kitchen };
  }
}

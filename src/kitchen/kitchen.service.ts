import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from '../inventory/entities/storage.entity';
import { ForecastsOutput } from './dtos/forecast.dto';
import { CreateKitchenInput, CreateKitchenOutput } from './dtos/Kitchen.dto';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/kitchen.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Kitchen) private readonly kitchen: Repository<Kitchen>,
    @InjectRepository(Order) private readonly order: Repository<Order>,
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
    @InjectRepository(Forecast) private readonly forecast: Repository<Forecast>,
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

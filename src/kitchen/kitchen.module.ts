import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/kitchen.entity';
import { Order } from './entities/order.entity';
import {
  ForecastResolver,
  KitchenResolver,
  OrderResolver,
} from './kitchen.resolver';
import { KitchenService } from './kitchen.service';
import { Storage } from '../inventory/entities/storage.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kitchen, Forecast, Order, Storage, Delivery]),
  ],
  providers: [KitchenResolver, KitchenService, ForecastResolver, OrderResolver],
  exports: [
    // RecipeService
  ],
})
export class KitchenModule {}

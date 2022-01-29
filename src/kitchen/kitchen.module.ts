import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/kitchen.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kitchen, Forecast, Order])],
  providers: [
    // RecipeService,
  ],
  exports: [
    // RecipeService
  ],
})
export class KitchenModule {}

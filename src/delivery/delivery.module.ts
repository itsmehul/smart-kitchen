import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/kitchen/entities/order.entity';
import { BowlService } from './bowl.service';
import { BoxService } from './box.service';
import {
  BowlResolver,
  BoxResolver,
  DeliveryResolver,
} from './delivery.resolver';
import { DeliveryService } from './delivery.service';
import { Bowl } from './entities/bowl.entity';
import { Box } from './entities/box.entity';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Box, Delivery, Bowl, Order])],
  providers: [
    BoxResolver,
    DeliveryService,
    BoxService,
    BowlResolver,
    BowlService,
    DeliveryService,
    DeliveryResolver,
  ],
  exports: [BoxService, DeliveryService, BowlService],
})
export class DeliveryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ScheduledtaskModule } from 'src/scheduledtask/scheduledtask.module';
import { Storage } from '../inventory/entities/storage.entity';
import { Kitchen } from './entities/kitchen.entity';
import { Lane } from './entities/lane.entity';
import { Order } from './entities/order.entity';
import {
  KitchenResolver,
  LaneResolver,
  OrderResolver,
} from './kitchen.resolver';
import { KitchenService } from './kitchen.service';
import { LaneService } from './lane.service';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kitchen, Order, Storage, Lane]),
    DeliveryModule,
    ScheduledtaskModule,
    InventoryModule,
  ],
  providers: [
    KitchenResolver,
    OrderResolver,
    LaneResolver,
    KitchenService,
    LaneService,
    OrderService,
  ],
  exports: [OrderService],
})
export class KitchenModule {}

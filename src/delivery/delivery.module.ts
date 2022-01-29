import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryResolver } from './delivery.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './entities/box.entity';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Box, Delivery])],
  providers: [DeliveryResolver, DeliveryService],
})
export class DeliveryModule {}

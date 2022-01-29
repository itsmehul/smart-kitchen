import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryInput } from './dto/update-delivery.input';

@Resolver(() => Delivery)
export class DeliveryResolver {
  constructor(private readonly deliveryService: DeliveryService) {}
}

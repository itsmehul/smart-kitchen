import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Box } from '../entities/box.entity';
import { Delivery } from '../entities/delivery.entity';

@InputType()
export class CreateDeliveryInput extends Delivery {}

@ObjectType()
export class DeliveriesOutput extends CoreOutput {
  @Field(() => [Delivery], { nullable: true })
  deliveries?: Delivery[];
}

@ObjectType()
export class BoxesToDeliverOutput extends CoreOutput {
  @Field(() => [[Box]], { nullable: true })
  boxes?: Box[][];
}

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Delivery } from '../entities/delivery.entity';

@InputType()
export class CreateDeliveryInput extends Delivery {}

@ObjectType()
export class DeliveriesOutput extends CoreOutput {
  @Field(() => [Delivery], { nullable: true })
  deliveries?: Delivery[];
}

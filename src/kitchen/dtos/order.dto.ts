import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Order } from '../entities/order.entity';

@InputType()
export class CreateOrderInput extends OmitType(Order, [
  'recipe',
  'kitchen',
  'box',
]) {
  @Field(() => Int, { defaultValue: 1 })
  qty: number;
}

@InputType()
export class CancelOrderInput {
  @Field(() => String)
  orderId: string;
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}

@InputType()
export class ShiftOrderInput {
  @Field(() => [String])
  kitchenOrderIds: string[];
}

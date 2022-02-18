import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Order, OrderStatus } from '../entities/order.entity';

@InputType()
export class CreateOrderInput extends OmitType(Order, [
  'recipe',
  'kitchen',
  // 'box',
]) {
  @Field(() => Int, { defaultValue: 1 })
  qty: number;
}

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => [String])
  orderIds: string[];
  @Field(() => OrderStatus)
  status: OrderStatus;
}

@InputType()
export class PackOrdersInput {
  @Field(() => [String])
  orderIds: string[];
}

@InputType()
export class PackOrderViaBowlInput {
  @Field(() => String)
  orderId: string;

  @Field(() => String)
  bowlId: string;
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

@ObjectType()
export class OrdersOutput extends CoreOutput {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}

@ObjectType()
export class OrdersIdsOutput {
  @Field(() => [String], { nullable: true })
  orderIds?: string[];
}

@InputType()
export class ShiftOrderInput {
  @Field(() => [String])
  kitchenOrderIds: string[];
}

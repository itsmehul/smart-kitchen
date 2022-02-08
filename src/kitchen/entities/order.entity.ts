import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Bowl } from 'src/delivery/entities/bowl.entity';
import { Box } from 'src/delivery/entities/box.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { BeforeInsert, Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Kitchen } from './kitchen.entity';

export enum OrderStatus {
  inKitchen = 'in_kitchen',
  inProcessing = 'in_processing',
  inCompleted = 'in_completed',
  inPackaging = 'in_packaging',
  cancelled = 'cancelled',
  withDriver = 'with_driver',
  delivered = 'delivered',
}

export const MOVEMENT_DIRECTION = [
  OrderStatus.inKitchen,
  OrderStatus.inProcessing,
  OrderStatus.inCompleted,
  OrderStatus.inPackaging,
  OrderStatus.withDriver,
  OrderStatus.delivered,
];

registerEnumType(OrderStatus, { name: 'OrderStatus' });

// To determine the flow with a QR scanner we will need the recipeId and external_id

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  orderId: string;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.inKitchen })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.inKitchen })
  status: OrderStatus;

  @Field(() => Kitchen, { nullable: true })
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.orders)
  kitchen?: Kitchen;

  @Field(() => Recipe)
  @ManyToOne(() => Recipe, (recipe) => recipe.orders)
  recipe: Recipe;

  @Field(() => Delivery)
  @ManyToOne(() => Delivery, (delivery) => delivery.orders, {
    cascade: true,
    nullable: true,
  })
  delivery?: Delivery;

  @Field(() => Bowl, { nullable: true })
  @ManyToOne(() => Bowl, (bowl) => bowl.orders, {
    nullable: true,
  })
  bowl?: Bowl;

  @Field(() => String, { nullable: true })
  @RelationId((order: Order) => order.recipe)
  recipeId: string;

  @Field(() => String, { nullable: true })
  @RelationId((order: Order) => order.kitchen)
  kitchenId: string;

  @Field(() => Box, { nullable: true })
  @ManyToOne(() => Box, (box) => box.orders)
  box?: Box;

  @BeforeInsert()
  async setStatusOnCreation(): Promise<void> {
    try {
      this.status = OrderStatus.inKitchen;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

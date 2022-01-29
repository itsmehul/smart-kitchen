import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Box } from 'src/delivery/entities/box.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Kitchen } from './kitchen.entity';

export enum OrderStatus {
  inKitchen = 'in_kitchen',
  inProcessing = 'in_processing',
  inCompleted = 'in_completed',
  inPackaging = 'in_packaging',
  withDriver = 'with_driver',
  delivered = 'delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

// To determine the flow with a QR scanner we will need the recipeId and external_id

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(() => String)
  @Column()
  orderId: string;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.inKitchen })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.inKitchen })
  status: OrderStatus;

  @Field(() => Kitchen, { nullable: true })
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.orders)
  kitchen?: Kitchen;

  @Field(() => Recipe)
  @OneToOne(() => Recipe)
  @JoinColumn()
  recipe: Recipe;

  @Field(() => Delivery)
  @ManyToOne(() => Delivery, (delivery) => delivery.orders)
  delivery?: Delivery;

  @Field(() => Box, { nullable: true })
  @ManyToOne(() => Box, (box) => box.orders)
  box?: Box;
}

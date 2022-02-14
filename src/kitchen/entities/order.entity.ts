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
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Kitchen } from './kitchen.entity';

export enum OrderStatus {
  // Order is accepted by kitchen
  RECEIVED = 'RECEIVED',
  // Scan dish and associate to order
  COMPLETED = 'COMPLETED',
  // Scan dish when placed in box
  PACKED = 'PACKED',
  // Associated box is scanned by driver on pickup
  ENROUTE = 'ENROUTE',
  // Associated box is scanned by driver on delivery
  DELIVERED = 'DELIVERED',
}

export const MOVEMENT_DIRECTION = [
  OrderStatus.RECEIVED,
  OrderStatus.COMPLETED,
  OrderStatus.PACKED,
  OrderStatus.ENROUTE,
  OrderStatus.DELIVERED,
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

  @Field(() => OrderStatus, { defaultValue: OrderStatus.RECEIVED })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
  })
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
  @OneToOne(() => Bowl, (bowl) => bowl.order, {
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
  @ManyToOne(() => Box, (box) => box.orders, { cascade: ['remove'] })
  box?: Box;

  @BeforeInsert()
  async setStatusOnCreation(): Promise<void> {
    try {
      this.status = OrderStatus.RECEIVED;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}

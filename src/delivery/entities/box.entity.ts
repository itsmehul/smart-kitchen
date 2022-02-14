import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import { Temperature } from 'src/recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

@InputType('BoxInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Box extends CoreEntity {
  @Field(() => [Order], { nullable: true, description: 'Orders in this box' })
  @OneToMany(() => Order, (order) => order.box, { nullable: true })
  orders?: Order[];

  @Field(() => Int)
  @Column({ type: 'int' })
  size: number;

  @Field(() => Temperature)
  @Column({ type: 'enum', enum: ['Hot', 'Cold'] })
  type: Temperature;

  @Field(() => Kitchen, { nullable: true })
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.boxes, {
    nullable: true,
  })
  kitchen?: Kitchen;

  @Field(() => String, { nullable: true })
  @RelationId((box: Box) => box.kitchen)
  kitchenId?: string;
}

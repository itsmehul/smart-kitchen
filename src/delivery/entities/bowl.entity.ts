import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';

@InputType('BowlInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Bowl extends CoreEntity {
  @Field(() => Order, { nullable: true, description: 'Orders in this Bowl' })
  @OneToOne(() => Order, (order) => order.bowl, {
    nullable: true,
  })
  @JoinColumn()
  order?: Order;

  @Field(() => Kitchen, { nullable: true })
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.bowls, {
    nullable: true,
  })
  kitchen?: Kitchen;

  @Field(() => String)
  @Column()
  qrCode: string;

  @Field(() => String, { nullable: true })
  @RelationId((bowl: Bowl) => bowl.kitchen)
  kitchenId?: string;
}

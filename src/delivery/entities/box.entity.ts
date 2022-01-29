import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Delivery } from './delivery.entity';

export enum BoxStatus {
  inKitchen = 'in_kitchen',
  inProcessing = 'in_processing',
  inCompleted = 'in_completed',
  inPackaging = 'in_packaging',
  withDriver = 'with_driver',
  delivered = 'delivered',
}

registerEnumType(BoxStatus, { name: 'BoxStatus' });

@InputType('BoxInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Box extends CoreEntity {
  @Field(() => String)
  @Column()
  customerId: string;

  @Field(() => [Order], { nullable: true, description: 'Orders in this box' })
  @OneToMany(() => Order, (order) => order.box)
  orders?: Order[];

  @Field(() => Delivery, { nullable: true })
  @ManyToOne(() => Delivery, (delivery) => delivery.boxes)
  delivery?: Delivery;
}

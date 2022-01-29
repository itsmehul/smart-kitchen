import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import {
  TiramizooDeliveryRequirement,
  TiramizooOrder,
} from 'src/tiramizoo/entities/tiramizoo.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Box } from './box.entity';

export enum DeliveryStatus {
  inKitchen = 'in_kitchen',
  inProcessing = 'in_processing',
  inCompleted = 'in_completed',
  inPackaging = 'in_packaging',
  withDriver = 'with_driver',
  delivered = 'delivered',
}

registerEnumType(DeliveryStatus, { name: 'DeliveryStatus' });

@InputType('DeliveryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Delivery extends CoreEntity {
  @Field(() => [Box], { nullable: true })
  @OneToMany(() => Box, (box) => box.delivery)
  boxes?: Box[];

  @Field(() => TiramizooOrder, { nullable: true })
  @OneToOne(() => TiramizooOrder, (tiramizooOrder) => tiramizooOrder.delivery)
  @JoinColumn()
  tiramizooOrder?: TiramizooOrder;

  @Field(() => String, { description: 'Name of the customer/branch' })
  @Column()
  name: string;

  @Field(() => String, {
    description: 'Link between your services with this one, ie- branchId',
  })
  @Column()
  external_id: string;

  @Field(() => Date, {
    description:
      'Provide the date and time for the given delivery of the order in UTC format',
  })
  @Column({ type: 'datetime' })
  deliveryDateTime: Date;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  postCode: string;

  @Field(() => String)
  @Column()
  countryCode: string;

  @Field(() => [TiramizooDeliveryRequirement], {
    nullable: true,
    description: 'Tiramizoo Delivery Requirement',
  })
  @Column({ type: 'json', nullable: true })
  requirements: TiramizooDeliveryRequirement[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.delivery)
  orders?: Order[];
}

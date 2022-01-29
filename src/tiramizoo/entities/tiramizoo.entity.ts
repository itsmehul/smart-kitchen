import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { TiramizooPackage } from './package.entity';

@InputType('TiramizooPickupInputType', { isAbstract: true })
@ObjectType()
export class TiramizooPickup {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  address_line: string;
  @Field(() => String)
  country_code: string;
  @Field(() => String)
  postal_code: string;
  @Field(() => String)
  city: string;
  @Field(() => String)
  phone_number: string;
  @Field(() => String)
  after: string;
  @Field(() => String)
  before: string;
  @Field(() => String)
  information: string;
}

@InputType('TiramizooDeliveryRequirementInputType', { isAbstract: true })
@ObjectType()
export class TiramizooDeliveryRequirement {
  @Field(() => String, { description: 'Signature or custom' })
  type: string;
  @Field(() => String)
  value: string;
}

@InputType('TiramizooDeliveryInputType', { isAbstract: true })
@ObjectType()
export class TiramizooDelivery {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  address_line: string;
  @Field(() => String)
  country_code: string;
  @Field(() => String)
  postal_code: string;
  @Field(() => String)
  city: string;
  @Field(() => String)
  phone_number: string;
  @Field(() => String)
  after: string;
  @Field(() => String)
  before: string;
  @Field(() => String)
  information: string;
  @Field(() => [TiramizooDeliveryRequirement])
  requirements: TiramizooDeliveryRequirement[];
}

@InputType('TiramizooOrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TiramizooOrder extends CoreEntity {
  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  cancellable: boolean;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  web_hook_url: string;

  @Field(() => String)
  @Column()
  external_id: string;

  @Field(() => TiramizooPickup)
  @Column({ type: 'json' })
  pickup: TiramizooPickup;

  @Field(() => TiramizooDelivery)
  @Column({ type: 'json' })
  delivery: TiramizooDelivery;

  @Field(() => [TiramizooPackage], { nullable: true })
  @OneToMany(
    () => TiramizooPackage,
    (tiramizooPackage) => tiramizooPackage.tiramizooOrder,
  )
  packages?: TiramizooPackage[];

  @Field(() => Delivery, { nullable: true })
  @OneToOne(() => Delivery, (delivery) => delivery.tiramizooOrder)
  mainDelivery?: Delivery;
}

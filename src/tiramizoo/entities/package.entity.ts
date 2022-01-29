import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TiramizooOrder } from './tiramizoo.entity';

@InputType('TiramizooPackageInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TiramizooPackage extends CoreEntity {
  @Field(() => String)
  @Column()
  weight: string;
  @Field(() => String)
  @Column()
  height: string;
  @Field(() => String)
  @Column()
  width: string;
  @Field(() => String)
  @Column()
  length: string;
  @Field(() => String)
  @Column()
  description: string;
  @Field(() => String)
  @Column()
  size: string;
  @Field(() => String)
  @Column()
  identifier: string;
  @Field(() => String)
  @Column()
  non_rotatable: string;
  @Field(() => String)
  @Column()
  external_id: string;
  @Field(() => String)
  @Column()
  pickup_state: string;

  @Field(() => TiramizooOrder, { nullable: true })
  @ManyToOne(() => TiramizooOrder, (tiramizooOrder) => tiramizooOrder.packages)
  tiramizooOrder?: TiramizooOrder;
}

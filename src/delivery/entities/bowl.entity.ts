import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

@InputType('BowlInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Bowl extends CoreEntity {
  @Field(() => [Order], { nullable: true, description: 'Orders in this Bowl' })
  @OneToMany(() => Order, (order) => order.bowl, {
    nullable: true,
  })
  orders?: Order[];

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

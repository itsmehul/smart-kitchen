import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Step } from 'src/recipe/entities/step.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Inventory } from './inventory.entity';

@InputType('ActionInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Action extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobileImageUrl: string;

  @Field(() => String, {
    nullable: true,
    description:
      'Used for suggesting the right tool/action for the selected ingredient; eg: 30ml red spoon can hold 15g of flour',
  })
  @Column({ nullable: true })
  qtyInMl: number;

  @Field(() => [Inventory], { nullable: true })
  @OneToMany(() => Inventory, (inventory) => inventory.action)
  inventories?: Inventory[];

  @Field(() => [Step], { nullable: true })
  @OneToMany(() => Step, (step) => step.action)
  steps: Step[];
}

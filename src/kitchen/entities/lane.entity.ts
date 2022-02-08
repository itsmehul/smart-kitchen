import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { BeforeInsert, Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Kitchen } from './kitchen.entity';

export enum LaneStatus {
  inKitchen = 'in_kitchen',
  inProcessing = 'in_processing',
  inCompleted = 'in_completed',
  inPackaging = 'in_packaging',
  withDriver = 'with_driver',
  delivered = 'delivered',
}

export const MOVEMENT_DIRECTION = [
  LaneStatus.inKitchen,
  LaneStatus.inProcessing,
  LaneStatus.inCompleted,
  LaneStatus.inPackaging,
  LaneStatus.withDriver,
  LaneStatus.delivered,
];

registerEnumType(LaneStatus, { name: 'LaneStatus' });

// To determine the flow with a QR scanner we will need the recipeId and external_id

@InputType('LaneInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Lane extends CoreEntity {
  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  serviceDate: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  forecastedQty: number;

  @Field(() => Int, {
    description: "What's remaining from what was forecasted",
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  remainingQty: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  forecastedDate: Date;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  inProcessing: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  inKitchen: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  inComplete: number;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe, (recipe) => recipe.forecasts)
  recipe?: Recipe;

  @Field(() => Kitchen)
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.lanes)
  kitchen: Kitchen;

  @Field(() => String)
  @RelationId((lane: Lane) => lane.recipe)
  recipeId: string;

  @Field(() => String)
  @RelationId((lane: Lane) => lane.kitchen)
  kitchenId: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.forecastedQty) {
      try {
        this.remainingQty = this.forecastedQty;
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
}

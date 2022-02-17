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
  inProcessing = 'inProcessing',
  inKitchen = 'inKitchen',
  inCompleted = 'inCompleted',
}

export const MOVEMENT_DIRECTION = [
  LaneStatus.inKitchen,
  LaneStatus.inProcessing,
  LaneStatus.inCompleted,
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
  inCompleted: number;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe)
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
  async addRemainingQty(): Promise<void> {
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

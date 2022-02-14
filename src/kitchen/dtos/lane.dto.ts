import {
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Lane, LaneStatus } from '../entities/lane.entity';

export enum OrderActionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

registerEnumType(Direction, { name: 'Direction' });

registerEnumType(OrderActionType, { name: 'OrderActionType' });

@InputType()
export class OrderToLaneInput extends PickType(Lane, [
  'serviceDate',
  'recipeId',
]) {
  @Field(() => Int)
  orderedQty: number;
  @Field(() => OrderActionType)
  action: OrderActionType;
}

@InputType()
export class UpdateForecastInput extends PickType(Lane, [
  'forecastedQty',
  'recipeId',
  'serviceDate',
]) {}

@InputType()
export class PromoteRecipesInput extends PickType(Lane, [
  'serviceDate',
  'recipeId',
]) {
  @Field(() => Int)
  qty: number;
}

@InputType()
export class ShiftRecipeToLaneInput extends PickType(Lane, [
  'serviceDate',
  'recipeId',
]) {
  @Field(() => Int)
  qty: number;

  @Field(() => LaneStatus, { description: 'Lane to move from' })
  lane: LaneStatus;

  @Field(() => Direction, { description: 'direction to move' })
  direction: Direction;
}

@InputType()
export class GetLaneEntryInput extends PickType(Lane, [
  'serviceDate',
  'recipeId',
]) {}

@ObjectType()
export class CreateLaneOutput extends CoreOutput {
  @Field(() => Lane, { nullable: true })
  Lane?: Lane;
}

@ObjectType()
export class LanesOutput extends CoreOutput {
  @Field(() => [Lane], { nullable: true })
  Lanes?: Lane[];
}

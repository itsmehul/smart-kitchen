import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { BeforeInsert, Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Kitchen } from './kitchen.entity';

@InputType('ForecastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Forecast extends CoreEntity {
  @Field(() => Date)
  @Column({ type: 'date' })
  @IsDate()
  serviceDate: Date;

  @Field(() => Int)
  @Column({ type: 'int' })
  originalQty: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  remainingQty: number;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe, (recipe) => recipe.forecasts)
  recipe?: Recipe;

  @Field(() => Kitchen, { nullable: true })
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.forecasts)
  kitchen?: Kitchen;

  @Field(() => String, { nullable: true })
  @RelationId((forecast: Forecast) => forecast.recipe)
  recipeId?: string;

  @Field(() => String, { nullable: true })
  @RelationId((forecast: Forecast) => forecast.kitchen)
  kitchenId?: string;

  @BeforeInsert()
  async updateRemainingQty(): Promise<void> {
    if (this.originalQty) {
      try {
        this.remainingQty = this.originalQty;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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
}

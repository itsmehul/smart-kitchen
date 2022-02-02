import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NutritionOutput {
  @Field(() => Float, { nullable: true })
  fats?: number;

  @Field(() => Float, { nullable: true })
  carbohydrates?: number;

  @Field(() => Float, { nullable: true })
  proteins?: number;

  @Field(() => Float, { nullable: true })
  calories?: number;
}

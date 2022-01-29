import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Ingredient } from 'src/inventory/entities/ingredient.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cookbook } from './cookbook.entity';
import { Recipe } from './recipe.entity';

@InputType('RecipeIngredientInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class RecipeIngredient extends CoreEntity {
  @Field(() => Ingredient, { nullable: true })
  @ManyToOne(() => Ingredient, {
    eager: true,
    // cascade: ['insert', 'update'],
    nullable: true,
  })
  ingredient: Ingredient;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe, {
    eager: true,
    nullable: true,
  })
  subRecipe: Recipe;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float' })
  qty: number;

  @Field(() => Cookbook, { nullable: true })
  @ManyToOne(() => Cookbook, (cookbook) => cookbook.recipeIngredients, {
    nullable: true,
  })
  cookbook: Cookbook;
}

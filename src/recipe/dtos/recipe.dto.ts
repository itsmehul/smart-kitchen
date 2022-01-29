import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Action } from 'src/inventory/entities/action.entity';
import { Ingredient } from 'src/inventory/entities/ingredient.entity';
import { Cookbook } from '../entities/cookbook.entity';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from '../entities/recipe_ingredient';
import { Step } from '../entities/step.entity';

// @InputType()
// export class CreateRecipeInput extends OmitType(Recipe, [
//   'forecasts',
//   'inventories',
//   'menus',
// ]) {}

@InputType()
export class UpdateIngredientInput extends PartialType(Ingredient) {}

@InputType()
export class UpdateRecipeInput extends PartialType(Recipe) {}

@InputType()
export class UpdateActionInput extends PartialType(Action) {}

@InputType()
export class UpdateStepInput extends PartialType(Step) {
  @Field(() => UpdateIngredientInput, { nullable: true })
  ingredient?: Ingredient;
  @Field(() => UpdateRecipeInput, { nullable: true })
  subRecipe?: Recipe;
  @Field(() => UpdateActionInput, { nullable: true })
  action?: Action;
}

@InputType()
export class UpdateRecipeIngredientInput extends PartialType(RecipeIngredient) {
  @Field(() => UpdateIngredientInput, { nullable: true })
  ingredient?: Ingredient;

  @Field(() => UpdateRecipeInput, { nullable: true })
  subRecipe?: Recipe;
}

@InputType()
export class UpdateCookbookInput extends PartialType(Cookbook) {
  @Field(() => [UpdateRecipeIngredientInput], { nullable: true })
  recipeIngredients?: RecipeIngredient[];

  @Field(() => [UpdateStepInput], { nullable: true })
  steps?: Step[];
}

@InputType()
export class CreateRecipeInput extends PartialType(Recipe) {
  @Field(() => UpdateCookbookInput, { nullable: true })
  cookbook?: Cookbook;
}

@ObjectType()
export class CreateRecipeOutput extends CoreOutput {
  @Field(() => Recipe, { nullable: true })
  recipe?: Recipe;
}

@ObjectType()
export class BulkCreateRecipeOutput extends CoreOutput {
  @Field(() => Recipe, { nullable: true })
  recipes?: Recipe[];
}

@ObjectType()
export class RecipesOutput extends CoreOutput {
  @Field(() => [Recipe], { nullable: true })
  recipes?: Recipe[];
}

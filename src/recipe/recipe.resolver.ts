import {
  Args,
  Float,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Action } from 'src/inventory/entities/action.entity';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateCategoryOutput,
  CreateCategoryInput,
} from './dtos/Category.dto';
import { NutritionOutput } from './dtos/nutrition.dto';
import {
  CreateRecipeInput,
  CreateRecipeOutput,
  RecipesOutput,
} from './dtos/recipe.dto';
import {
  BulkCreateStationOutput,
  CreateStationInput,
} from './dtos/station.dto';
import { Category } from './entities/Category.entity';
import { Cookbook } from './entities/cookbook.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe_ingredient';
import { Station } from './entities/station.entity';
import { RecipeService } from './recipe.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Mutation(() => BulkCreateCategoryOutput)
  async createBulkCategory(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateCategoryInput] })
    input: CreateCategoryInput[],
  ): Promise<BulkCreateCategoryOutput> {
    return this.recipeService.bulkCreateCategory(input);
  }
}
@Resolver(() => Action)
export class ActionResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Mutation(() => BulkCreateActionOutput)
  async createBulkAction(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateActionInput] })
    input: CreateActionInput[],
  ): Promise<BulkCreateActionOutput> {
    return this.recipeService.bulkCreateAction(input);
  }
}

@Resolver(() => Station)
export class StationResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Mutation(() => BulkCreateStationOutput)
  async createBulkStation(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateStationInput] })
    input: CreateStationInput[],
  ): Promise<BulkCreateStationOutput> {
    return this.recipeService.bulkCreateStation(input);
  }
}

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Mutation(() => CreateRecipeOutput)
  async createBulkRecipe(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateRecipeInput] })
    input: CreateRecipeInput[],
  ): Promise<CreateRecipeOutput> {
    return this.recipeService.bulkCreateSubrecipe(input);
  }

  @Query(() => RecipesOutput)
  getRecipes(): Promise<RecipesOutput> {
    return this.recipeService.getRecipes();
  }
}

@Resolver(() => Cookbook)
export class CookbookResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @ResolveField(() => NutritionOutput)
  async nutritionalData(@Parent() cookbook: Cookbook) {
    const nutritionalData = {
      fats: 0,
      carbohydrates: 0,
      proteins: 0,
      calories: 0,
    };
    let totalWeight = 0;
    const getNutrionalData = (recipeIngredients: RecipeIngredient[]) => {
      for (const recipeIng of recipeIngredients) {
        if (recipeIng?.ingredient) {
          totalWeight += recipeIng.qty;

          nutritionalData.fats +=
            Number(recipeIng.ingredient.fats) * recipeIng.qty;
          nutritionalData.carbohydrates +=
            Number(recipeIng.ingredient.carbohydrates) * recipeIng.qty;
          nutritionalData.proteins +=
            Number(recipeIng.ingredient.proteins) * recipeIng.qty;
          nutritionalData.calories +=
            Number(recipeIng.ingredient.calories) * recipeIng.qty;
        } else if (recipeIng?.subRecipe?.cookbook?.recipeIngredients) {
          getNutrionalData(recipeIng.subRecipe.cookbook.recipeIngredients);
        }
      }
    };
    getNutrionalData(cookbook.recipeIngredients);

    nutritionalData.calories = nutritionalData.calories / totalWeight;
    nutritionalData.fats = nutritionalData.fats / totalWeight;
    nutritionalData.carbohydrates = nutritionalData.carbohydrates / totalWeight;
    nutritionalData.proteins = nutritionalData.proteins / totalWeight;

    return nutritionalData;
  }

  @ResolveField(() => Int)
  async possibleStock(@Parent() cookbook: Cookbook) {
    let stock;
    const getStockFromRecipeIngredients = (
      recipeIngredients: RecipeIngredient[],
      parentQty,
    ) => {
      for (const recipeIng of recipeIngredients) {
        if (recipeIng?.ingredient) {
          //FIX: Find latest invetory
          const possibleStock = Number(
            (
              recipeIng.ingredient.inventories[0].qty /
              (recipeIng.qty * parentQty)
            ).toFixed(0),
          );
          if (possibleStock < stock || !stock) {
            stock = possibleStock;
          }
        } else if (recipeIng?.subRecipe?.cookbook?.recipeIngredients) {
          getStockFromRecipeIngredients(
            recipeIng.subRecipe.cookbook.recipeIngredients,
            recipeIng.qty,
          );
        }
      }
    };
    getStockFromRecipeIngredients(cookbook.recipeIngredients, 1);

    return stock;
  }

  @ResolveField(() => Float)
  async totalIngredientCost(@Parent() cookbook: Cookbook) {
    let price = 0;
    const getPriceFromIngredients = (
      recipeIngredients: RecipeIngredient[],
      parentQty,
    ) => {
      for (const recipeIng of recipeIngredients) {
        if (recipeIng?.ingredient) {
          //FIX: Find latest invetory
          price +=
            recipeIng.ingredient.inventories[0].pricePerUnit *
            recipeIng.qty *
            parentQty;
        } else if (recipeIng?.subRecipe?.cookbook?.recipeIngredients) {
          getPriceFromIngredients(
            recipeIng.subRecipe.cookbook.recipeIngredients,
            recipeIng.qty,
          );
        }
      }
    };
    getPriceFromIngredients(cookbook.recipeIngredients, 1);

    return price;
  }

  @ResolveField(() => Float, { description: 'Weight in grams' })
  async totalWeight(@Parent() cookbook: Cookbook) {
    let qty = 0;
    const getTotalWeight = (
      recipeIngredients: RecipeIngredient[],
      parentQty,
    ) => {
      for (const recipeIng of recipeIngredients) {
        if (recipeIng?.ingredient) {
          //FIX: Find latest invetory
          qty += recipeIng.qty * parentQty;
        } else if (recipeIng?.subRecipe?.cookbook?.recipeIngredients) {
          getTotalWeight(
            recipeIng.subRecipe.cookbook.recipeIngredients,
            recipeIng.qty,
          );
        }
      }
    };
    getTotalWeight(cookbook.recipeIngredients, 1);

    return qty;
  }
}

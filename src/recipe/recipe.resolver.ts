import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Action } from 'src/inventory/entities/action.entity';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateCategoryOutput,
  CreateCategoryInput,
} from './dtos/Category.dto';
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
import { Recipe } from './entities/recipe.entity';
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

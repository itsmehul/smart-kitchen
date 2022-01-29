import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/inventory/entities/action.entity';
import { Ingredient } from 'src/inventory/entities/ingredient.entity';
import { Repository } from 'typeorm';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateCategoryOutput,
  CreateCategoryInput,
} from './dtos/category.dto';
import {
  BulkCreateRecipeOutput,
  CreateRecipeInput,
  RecipesOutput,
} from './dtos/recipe.dto';
import {
  BulkCreateStationOutput,
  CreateStationInput,
} from './dtos/station.dto';
import { Category } from './entities/category.entity';
import { Cookbook } from './entities/cookbook.entity';
import { Recipe } from './entities/Recipe.entity';
import { RecipeIngredient } from './entities/recipe_ingredient';
import { Station } from './entities/station.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipe: Repository<Recipe>,
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
    @InjectRepository(Station)
    private readonly station: Repository<Category>,
    @InjectRepository(Cookbook)
    private readonly cookbook: Repository<Cookbook>,
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredient: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient)
    private readonly ingredient: Repository<Ingredient>,
    @InjectRepository(Action)
    private readonly action: Repository<Action>,
  ) {}

  async bulkCreateCategory(
    input: CreateCategoryInput[],
  ): Promise<BulkCreateCategoryOutput> {
    const categories = await this.category.save(input);
    return { ok: true, categories };
  }

  async bulkCreateAction(
    input: CreateActionInput[],
  ): Promise<BulkCreateActionOutput> {
    const actions = await this.action.save(input);
    return { ok: true, actions };
  }

  async bulkCreateStation(
    input: CreateStationInput[],
  ): Promise<BulkCreateStationOutput> {
    const stations = await this.station.save(input);
    return { ok: true, stations };
  }

  async getRecipes(): Promise<RecipesOutput> {
    const recipes = await this.recipe.find({
      relations: [
        'cookbook',
        'cookbook.steps',
        'cookbook.steps.ingredient',
        'cookbook.steps.subRecipe',
        'cookbook.steps.action',
        'cookbook.recipeIngredients',
        'cookbook.recipeIngredients.ingredient',
        'cookbook.recipeIngredients.subRecipe',
        'station',
        'category',
      ],
    });
    return {
      ok: true,
      recipes,
    };
  }

  async bulkCreateSubrecipe(
    input: CreateRecipeInput[],
  ): Promise<BulkCreateRecipeOutput> {
    const recipes = [];
    for (const recipe of input) {
      const cookbook = this.cookbook.create(recipe.cookbook);

      for (const step of cookbook.steps) {
        let action;
        if (step.action?.id) {
          action = await this.action.findOne(step.action.id);
        }
        step.action = action;
        if (step.ingredient) {
          step.ingredient = await this.ingredient.findOne(step.ingredient.id);
        }
        if (step.subRecipe) {
          step.subRecipe = await this.recipe.findOne(step.subRecipe.id);
        }
      }

      for (const recipeIngredient of cookbook.recipeIngredients) {
        if (recipeIngredient.ingredient) {
          recipeIngredient.ingredient = await this.ingredient.findOne(
            recipeIngredient.ingredient.id,
          );
        }
        if (recipeIngredient.subRecipe) {
          recipeIngredient.subRecipe = await this.recipe.findOne(
            recipeIngredient.subRecipe.id,
          );
        }
      }

      let category;
      if (recipe.category?.id) {
        category = await this.category.findOne(recipe.category.id);
      }

      if (!category) {
        category = this.category.create(recipe.category);
      }

      let station;
      if (recipe.station?.name) {
        station = await this.station.findOne({
          where: { name: recipe.station.name },
        });
      }

      if (!station && recipe.station) {
        station = this.station.create(recipe.station);
      }

      recipes.push(
        this.recipe.create({
          ...recipe,
          cookbook,
          category,
          station,
        }),
      );
    }
    const savedRecipe = await this.recipe.save(recipes);
    return { ok: true, recipes: savedRecipe };
  }
}

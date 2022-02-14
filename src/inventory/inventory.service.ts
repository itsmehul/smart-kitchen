import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { ArithmeticOperator } from 'src/common/common.interfaces';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { RecipeIngredient } from 'src/recipe/entities/recipe_ingredient';
import { Repository } from 'typeorm';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateIngredientOutput,
  CreateIngredientInput,
  CreateIngredientOutput,
  IngredientsOutput,
} from './dtos/ingredient.dto';
import { Action } from './entities/action.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventory: Repository<Inventory>,
    @InjectRepository(Ingredient)
    private readonly ingredient: Repository<Ingredient>,
    @InjectRepository(Action)
    private readonly action: Repository<Action>,
    @InjectRepository(Recipe)
    private readonly recipe: Repository<Recipe>,
  ) {}

  async createIngredient(
    input: CreateIngredientInput,
  ): Promise<CreateIngredientOutput> {
    for (let inventory of input.inventories) {
      inventory = this.inventory.create(inventory);
    }

    const ingredient = await this.ingredient.save(input);
    return { ok: true, ingredient };
  }

  async bulkCreateIngredient(
    input: CreateIngredientInput[],
  ): Promise<BulkCreateIngredientOutput> {
    for (const ingredient of input) {
      ingredient.inventories = ingredient.inventories.map((inventory) =>
        this.inventory.create({
          ...inventory,
          name: `${ingredient.name} - inventory`,
        }),
      );
    }

    const ingredients = await this.ingredient.save(input);
    return { ok: true, ingredients };
  }

  async bulkCreateAction(
    input: CreateActionInput[],
  ): Promise<BulkCreateActionOutput> {
    const actions = await this.action.save(input);
    return { ok: true, actions };
  }

  async getIngredients(): Promise<IngredientsOutput> {
    const ingredients = await this.ingredient.find({
      relations: ['inventories'],
    });
    return {
      ok: true,
      ingredients,
    };
  }

  async updateStockForRecipe(
    recipeId: string,
    orderedQty: number,
    kitchenId: string,
    operation: ArithmeticOperator,
  ): Promise<{ allInventoriesAffected: Inventory[]; possibleStock: number }> {
    const allInventoriesAffected = [];
    let possibleStock = 99999;

    const foundRecipe = await this.recipe.findOne({
      where: {
        id: recipeId,
      },
      relations: [
        'cookbook',
        'cookbook.steps',
        'cookbook.steps.ingredient',
        'cookbook.steps.subRecipe',
        'cookbook.steps.action',
        'cookbook.recipeIngredients',
        'cookbook.recipeIngredients.ingredient',
        'cookbook.recipeIngredients.subRecipe',
        'cookbook.recipeIngredients.subRecipe.cookbook',
        'station',
        'category',
      ],
    });

    const getStockFromRecipeIngredients = (
      recipeIngredients: RecipeIngredient[],
      parentQty,
    ) => {
      for (const recipeIng of recipeIngredients) {
        if (recipeIng?.ingredient) {
          const inventories = recipeIng.ingredient.inventories.filter(
            (inv) =>
              inv.storage.kitchenId === kitchenId &&
              DateTime.fromISO(inv.expiry) > DateTime.now(),
          );
          let quantityNeeded = recipeIng.qty * parentQty * orderedQty;
          const quantityNeededCpy = quantityNeeded;
          inventories.forEach((inv) => {
            if (operation === ArithmeticOperator.SUBTRACT) {
              if (inv.qty >= quantityNeeded) {
                inv.qty -= quantityNeeded;
                quantityNeeded = 0;
              } else {
                quantityNeeded -= inv.qty;
                inv.qty = 0;
              }
            } else {
              inv.qty += quantityNeeded;
              quantityNeeded = 0;
            }
            possibleStock = Math.min(
              possibleStock,
              Math.floor(inv.qty / quantityNeededCpy),
            );
          });

          if (quantityNeeded > 0) {
            console.log('Error in quantity estimation');
          }

          allInventoriesAffected.push(...inventories);
        } else if (recipeIng?.subRecipe?.cookbook?.recipeIngredients) {
          // Check if any stock for this subrecipe exist, else we will need to create it on the spot
          if (recipeIng.subRecipe.inventories.length > 0) {
            const inventories = recipeIng.subRecipe.inventories.filter(
              (inv) =>
                inv.storage.kitchenId === kitchenId &&
                DateTime.fromISO(inv.expiry) > DateTime.now(),
            );
            let quantityNeeded = recipeIng.qty * parentQty * orderedQty;
            const quantityNeededCpy = quantityNeeded;

            inventories.forEach((inv) => {
              if (operation === ArithmeticOperator.SUBTRACT) {
                if (inv.qty >= quantityNeeded) {
                  inv.qty -= quantityNeeded;
                  quantityNeeded = 0;
                } else {
                  quantityNeeded -= inv.qty;
                  inv.qty = 0;
                }
              } else {
                inv.qty += quantityNeeded;
                quantityNeeded = 0;
              }
              possibleStock = Math.min(
                possibleStock,
                Math.floor(inv.qty / quantityNeededCpy),
              );
            });

            if (quantityNeeded > 0 && operation === 'SUBTRACT') {
              console.log('Error in quantity estimation');
            }

            allInventoriesAffected.push(...inventories);
          }
          // This will recursively remove the ingredients from the subrecipe
          else {
            getStockFromRecipeIngredients(
              recipeIng.subRecipe.cookbook.recipeIngredients,
              recipeIng.qty,
            );
          }
        }
      }
    };
    getStockFromRecipeIngredients(foundRecipe.cookbook.recipeIngredients, 1);

    return { allInventoriesAffected, possibleStock };
  }
}

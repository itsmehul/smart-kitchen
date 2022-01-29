import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateIngredientOutput,
  CreateIngredientInput,
  CreateIngredientOutput,
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
  ) {}

  async createIngredient(
    input: CreateIngredientInput,
  ): Promise<CreateIngredientOutput> {
    const ingredient = await this.ingredient.save(input);
    return { ok: true, ingredient };
  }

  async bulkCreateIngredient(
    input: CreateIngredientInput[],
  ): Promise<BulkCreateIngredientOutput> {
    const ingredients = await this.ingredient.save(input);
    return { ok: true, ingredients };
  }

  async bulkCreateAction(
    input: CreateActionInput[],
  ): Promise<BulkCreateActionOutput> {
    const actions = await this.action.save(input);
    return { ok: true, actions };
  }
}

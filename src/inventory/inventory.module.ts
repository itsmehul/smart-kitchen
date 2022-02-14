import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Inventory } from './entities/inventory.entity';
import { Action } from './entities/action.entity';
import { Storage } from './entities/storage.entity';
import {
  ActionResolver,
  IngredientResolver,
  InventoryResolver,
} from './inventory.resolver';
import { InventoryService } from './inventory.service';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { InventoryListener } from './inventory.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, Inventory, Storage, Action, Recipe]),
  ],
  providers: [
    InventoryService,
    IngredientResolver,
    ActionResolver,
    InventoryListener,
    InventoryResolver,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}

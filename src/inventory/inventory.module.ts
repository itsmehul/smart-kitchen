import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Inventory } from './entities/inventory.entity';
import { Action } from './entities/action.entity';
import { Storage } from './entities/storage.entity';
import { ActionResolver, IngredientResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, Inventory, Storage, Action])],
  providers: [InventoryService, IngredientResolver, ActionResolver],
})
export class InventoryModule {}

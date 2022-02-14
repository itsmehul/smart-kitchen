import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'src/inventory/entities/action.entity';
import { Ingredient } from 'src/inventory/entities/ingredient.entity';
import { Category } from './entities/category.entity';
import { Cookbook } from './entities/cookbook.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe_ingredient';
import { Station } from './entities/station.entity';
import { Step } from './entities/step.entity';
import {
  CategoryResolver,
  CookbookResolver,
  RecipeResolver,
  StationResolver,
} from './recipe.resolver';
import { RecipeService } from './recipe.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      Step,
      Cookbook,
      Category,
      Station,
      RecipeIngredient,
      Ingredient,
      Action,
    ]),
  ],
  providers: [
    RecipeService,
    CategoryResolver,
    StationResolver,
    RecipeResolver,
    CookbookResolver,
  ],
  exports: [RecipeService],
})
export class RecipeModule {}

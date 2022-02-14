import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Ingredient } from '../entities/ingredient.entity';
import { Inventory } from '../entities/inventory.entity';
@InputType()
export class UpdateInventoryInput extends PartialType(Inventory) {}

@InputType()
export class CreateIngredientInput extends PartialType(Ingredient) {
  @Field(() => [UpdateInventoryInput], { nullable: true })
  inventories?: Inventory[];
}

@ObjectType()
export class CreateIngredientOutput extends CoreOutput {
  @Field(() => Ingredient, { nullable: true })
  ingredient?: Ingredient;
}

@ObjectType()
export class BulkCreateIngredientOutput extends CoreOutput {
  @Field(() => [Ingredient], { nullable: true })
  ingredients?: Ingredient[];
}

@ObjectType()
export class IngredientsOutput extends CoreOutput {
  @Field(() => [Ingredient], { nullable: true })
  ingredients?: Ingredient[];
}
@ObjectType()
export class StockOutput {
  @Field(() => String)
  recipeId: string;
  @Field(() => Int)
  possibleStock: number;
}

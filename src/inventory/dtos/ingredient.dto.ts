import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Ingredient } from '../entities/ingredient.entity';

@InputType()
export class CreateIngredientInput extends PartialType(Ingredient) {}

@ObjectType()
export class CreateIngredientOutput extends CoreOutput {
  @Field(() => Ingredient, { nullable: true })
  ingredient?: Ingredient;
}

@ObjectType()
export class BulkCreateIngredientOutput extends CoreOutput {
  @Field(() => Ingredient, { nullable: true })
  ingredients?: Ingredient[];
}

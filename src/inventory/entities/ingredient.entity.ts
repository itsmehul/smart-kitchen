import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Inventory } from './inventory.entity';

export enum Diet {
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
  MEAT = 'MEAT',
  FISH = 'FISH',
}

export enum Type {
  PRODUCE = 'PRODUCE',
  READYMADE = 'READYMADE',
  SEASONAL = 'SEASONAL',
  DRY = 'DRY',
  WATER = 'WATER',
  DAIRY = 'DAIRY',
  FROZEN = 'FROZEN',
  GROCERY = 'GROCERY',
  VEGETABLE = 'VEGETABLE',
  MEAT = 'MEAT',
  PROTEIN = 'PROTEIN',
}

export enum Allergen {
  EGGS = 'EGGS',
  GLUTEN = 'GLUTEN',
  PEANUTS = 'PEANUTS',
  SHELLFISH = 'SHELLFISH',
  SOY = 'SOY',
  TREENUTS = 'TREENUTS',
  WHEAT = 'WHEAT',
  NUTS = 'NUTS',
}

export enum UnitType {
  mL = 'mL',
  g = 'g',
  ea = 'ea',
}

registerEnumType(Diet, { name: 'Diet' });
registerEnumType(Type, { name: 'Type' });
registerEnumType(Allergen, { name: 'Allergen' });
registerEnumType(UnitType, { name: 'UnitType' });

@InputType('IngredientInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Ingredient extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  localization: string;

  @Field(() => Type)
  @Column({ type: 'enum', enum: Type })
  type: Type;

  @Field(() => String)
  @Column({ type: 'enum', enum: Diet })
  diet: Diet;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  webImageUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobileImageUrl: string;

  @Field(() => Float, { description: 'Per unit' })
  @Column({ type: 'float' })
  fats: number;

  @Field(() => Float, { description: 'Per unit' })
  @Column({ type: 'float' })
  carbohydrates: number;

  @Field(() => Float, { description: 'Per unit' })
  @Column({ type: 'float' })
  proteins: number;

  @Field(() => Float, { description: 'Per unit' })
  @Column({ type: 'float' })
  calories: number;

  @Field(() => Float, {
    description: 'Density; Get the best estimate of weight(in grams) per unit.',
    nullable: true,
  })
  @Column({
    type: 'float',
    nullable: true,
    default: 20,
  })
  weightPerUnit: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: UnitType, nullable: true, default: UnitType.g })
  unit: UnitType;

  @Field(() => [Inventory])
  @OneToMany(() => Inventory, (inventory) => inventory.ingredient, {
    cascade: true,
    eager: true,
  })
  inventories: Inventory[];

  @Field(() => [String])
  @Column({ type: 'simple-array' })
  allergens: Allergen[];
}

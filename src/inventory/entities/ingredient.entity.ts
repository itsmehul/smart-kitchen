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

  @Field(() => String)
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

  @Field(() => Float, { description: 'Per gram' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fats: number;

  @Field(() => Float, { description: 'Per gram' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  carbohydrates: number;

  @Field(() => Float, { description: 'Per gram' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  proteins: number;

  @Field(() => Float, { description: 'Per gram' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  calories: number;

  @Field(() => Float, {
    description:
      'Get the best estimate of weight per ml. You can ignore this for pieces. Use weight/piece',
    nullable: true,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 20,
  })
  weightPerMillitre: number;

  @Field(() => UnitType, { nullable: true })
  @Column({ type: 'enum', enum: UnitType, nullable: true })
  unit: UnitType;

  @Field(() => Float, {
    description: 'Get the weight per piece',
    nullable: true,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 20,
  })
  weightPerPiece: number;

  @Field(() => [Inventory])
  @OneToMany(() => Inventory, (inventory) => inventory.ingredient)
  inventories: Inventory[];

  @Field(() => [String])
  @Column({ type: 'simple-array' })
  allergens: Allergen[];
}

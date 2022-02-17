import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Action } from './action.entity';
import { Ingredient, UnitType } from './ingredient.entity';
import { Storage } from './storage.entity';

@InputType('InventoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Inventory extends CoreEntity {
  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  localization: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  expiry: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  qty: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: UnitType, default: UnitType.g, nullable: true })
  unit: UnitType;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerUnit: number;

  @Field(() => Ingredient, { nullable: true })
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.inventories)
  ingredient?: Ingredient;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe, (recipe) => recipe.inventories)
  subRecipe?: Recipe;

  @Field(() => Action, { nullable: true })
  @ManyToOne(() => Action, (action) => action.inventories)
  action?: Action;

  @Field(() => Storage, { nullable: true })
  @ManyToOne(() => Storage, (storage) => storage.inventories, { eager: true })
  storage?: Storage;
}

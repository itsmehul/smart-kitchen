import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Action } from './action.entity';
import { Ingredient } from './ingredient.entity';
import { Storage } from './storage.entity';

@InputType('InventoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Inventory extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String)
  @Column()
  localization: string;

  @Field(() => Date)
  @Column({ type: 'date' })
  expiry: Date;

  @Field(() => String)
  @Column()
  qty: string;

  // @Field(() => UnitType)
  // @Column({ type: 'enum', enum: UnitType })
  // unit: UnitType;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
  @ManyToOne(() => Storage, (Storage) => Storage.inventories)
  storage?: Storage;
}

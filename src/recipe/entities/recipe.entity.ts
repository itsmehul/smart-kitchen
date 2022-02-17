import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import { MenuDish } from 'src/menu/entities/menuDish.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Category } from './category.entity';
import { Cookbook } from './cookbook.entity';
import { Station } from './station.entity';

export enum Temperature {
  Hot = 'Hot',
  Cold = 'Cold',
}

registerEnumType(Temperature, { name: 'Temperature' });

@InputType('RecipeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Recipe extends CoreEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  webImageUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobileImageUrl: string;

  @Field(() => Int, {
    description: ' Higher the value spicier the recipe',
    nullable: true,
  })
  @Column({ nullable: true })
  spiciness: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: Temperature, nullable: true })
  type: Temperature;

  @Field(() => Cookbook, { nullable: true })
  @OneToOne(() => Cookbook, { nullable: true, cascade: true })
  @JoinColumn()
  cookbook: Cookbook;

  @Field(() => [Inventory])
  @OneToMany(() => Inventory, (inventory) => inventory.ingredient, {
    eager: true,
  })
  inventories: Inventory[];

  @Field(() => [MenuDish], { nullable: true })
  @OneToMany(() => MenuDish, (menuDish) => menuDish.dish)
  menuDishes?: MenuDish[];

  @Field(() => [Cookbook], {
    nullable: true,
    description:
      'Sub recipes can belong to multiple cookbooks unlike a main recipe',
  })
  @ManyToMany(() => Recipe, (recipe) => recipe.cookbooks)
  cookbooks: Cookbook[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.recipe)
  orders?: Order[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.recipes, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  category?: Category;

  @Field(() => Station, { nullable: true })
  @ManyToOne(() => Station, (station) => station.recipes, {
    cascade: ['insert', 'update'],
  })
  station?: Station;
}

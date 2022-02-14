import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Menu } from './menu.entity';

@InputType('MenuDishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class MenuDish extends CoreEntity {
  @Field(() => Int)
  @Column({ type: 'int' })
  serialNo: number;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe, (recipe) => recipe.menuDishes, {
    eager: true,
  })
  dish?: Recipe;

  @Field(() => Menu, { nullable: true })
  @ManyToOne(() => Menu, (menu) => menu.menuDishes)
  menu?: Menu;
}

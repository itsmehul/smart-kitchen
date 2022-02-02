import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Action } from 'src/inventory/entities/action.entity';
import { Ingredient } from 'src/inventory/entities/ingredient.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Cookbook } from './cookbook.entity';
import { Recipe } from './recipe.entity';

@InputType('StepInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Step extends CoreEntity {
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int' })
  stepNo: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  details: string;

  @Field(() => Ingredient, { nullable: true })
  @ManyToOne(() => Ingredient, {
    eager: true,
  })
  ingredient: Ingredient;

  @Field(() => Recipe, { nullable: true })
  @ManyToOne(() => Recipe, {
    eager: true,
  })
  subRecipe: Recipe;

  @Field(() => Action, { nullable: true })
  @ManyToOne(() => Action, (action) => action.steps)
  action: Action;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  qty: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true, default: 1 })
  yield: number;

  @Field(() => Step, { nullable: true })
  @ManyToOne(() => Step, (Step) => Step.childStep)
  parentStep: Step;

  @Field(() => [Step], { nullable: true })
  @OneToMany(() => Step, (Step) => Step.parentStep)
  childStep: Step[];

  @Field(() => Cookbook, { nullable: true })
  @ManyToOne(() => Cookbook, (cookbook) => cookbook.steps)
  cookbook: Cookbook;
}

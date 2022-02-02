import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe_ingredient';
import { Step } from './step.entity';

@InputType('InstructionInputType', { isAbstract: true })
@ObjectType()
export class Instruction {
  @Field(() => Int)
  serialNo: number;
  @Field(() => String)
  details: string;
  @Field(() => String, { nullable: true })
  videoUrl?: string;
  @Field(() => String, { nullable: true })
  imageUrl?: string;
  @Field(() => [Instruction], { nullable: true })
  subInstruction?: Instruction[];
}

@InputType('CookbookInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Cookbook extends CoreEntity {
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

  @Field(() => Recipe)
  @OneToOne(() => Recipe)
  recipe: Recipe;

  @Field(() => [RecipeIngredient], { nullable: true })
  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.cookbook,
    {
      cascade: true,
      eager: true,
    },
  )
  recipeIngredients: RecipeIngredient[];

  @Field(() => [Step], {
    description: 'Assembly steps in the cookbook',
    nullable: true,
  })
  @OneToMany(() => Step, (step) => step.cookbook, {
    nullable: true,
    cascade: true,
  })
  steps: Step[];

  @Field(() => [Instruction], { nullable: true })
  @Column({ type: 'json', nullable: true })
  instructions: Instruction[];
}

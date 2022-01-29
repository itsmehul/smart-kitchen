import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Recipe } from './recipe.entity';

@InputType('StationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Station extends CoreEntity {
  @Field(() => String, { nullable: true })
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  webImageUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobileImageUrl?: string;

  @Field(() => [Recipe], { nullable: true })
  @OneToMany(() => Recipe, (recipe) => recipe.station)
  recipes: Recipe[];
}

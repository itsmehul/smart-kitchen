import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@InputType('MenuInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Menu extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;

  @Field(() => Date)
  @Column({ type: 'date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @Column({ type: 'date' })
  @IsDate()
  endDate: Date;

  @Field(() => [Recipe], { nullable: true })
  @ManyToMany(() => Recipe, (recipe) => recipe.menus)
  @JoinTable()
  dishes?: Recipe[];

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  isActive: number;
}

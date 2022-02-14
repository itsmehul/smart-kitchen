import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MenuDish } from './menuDish.entity';

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

  @Field(() => [MenuDish], { nullable: true })
  @OneToMany(() => MenuDish, (menuDish) => menuDish.menu, {
    eager: true,
    cascade: true,
  })
  menuDishes?: MenuDish[];

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  isActive: number;
}

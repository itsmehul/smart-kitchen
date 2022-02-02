import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Storage } from '../../inventory/entities/storage.entity';
import { Forecast } from './forecast.entity';
import { Order } from './order.entity';

@InputType('KitchenInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Kitchen extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => Date)
  @Column({ type: 'time' })
  cutoffTime: Date;

  @Field(() => [Storage], { nullable: true })
  @OneToMany(() => Storage, (storage) => storage.kitchen, {
    cascade: ['insert'],
  })
  storages?: Storage[];

  @Field(() => String)
  @Column()
  region: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  isActive: number;

  @Field(() => [Date])
  @Column('simple-array')
  blackoutDates: Date[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.kitchen)
  orders?: Order[];

  @Field(() => [Forecast], { nullable: true })
  @OneToMany(() => Forecast, (forecast) => forecast.kitchen)
  forecasts?: Forecast[];
}

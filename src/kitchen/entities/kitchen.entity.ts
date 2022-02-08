import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Bowl } from 'src/delivery/entities/bowl.entity';
import { Box } from 'src/delivery/entities/box.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Storage } from '../../inventory/entities/storage.entity';
import { Forecast } from './forecast.entity';
import { Lane } from './lane.entity';
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

  @Field(() => String)
  @Column()
  addressLine: string;

  @Field(() => String)
  @Column()
  countryCode: string;

  @Field(() => String)
  @Column()
  pinCode: string;

  @Field(() => String)
  @Column({ default: 'tech@bellabona.com' })
  email: string;

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

  @Field(() => [Bowl], { nullable: true })
  @OneToMany(() => Bowl, (bowl) => bowl.kitchen)
  bowls?: Bowl[];

  @Field(() => [Box], { nullable: true })
  @OneToMany(() => Box, (box) => box.kitchen)
  boxes?: Box[];

  @Field(() => [Lane])
  @OneToMany(() => Lane, (lane) => lane.kitchen)
  lanes?: Lane[];

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.kitchen)
  staff?: User[];
}

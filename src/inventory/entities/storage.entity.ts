import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Inventory } from './inventory.entity';

export enum StorageType {
  Fridge = 'Fridge',
  Box = 'Box',
}

registerEnumType(StorageType, { name: 'StorageType' });

@InputType('StorageInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Storage extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => StorageType)
  @Column({ type: 'enum', enum: StorageType })
  type: StorageType;

  @Field(() => [Inventory], { nullable: true })
  @OneToMany(() => Inventory, (inventory) => inventory.storage)
  inventories?: Inventory[];

  @Field(() => Kitchen, { nullable: true })
  @ManyToOne(() => Kitchen, (kitchen) => kitchen.storages)
  kitchen?: Kitchen;

  @RelationId((storage: Storage) => storage.kitchen)
  kitchenId?: string;
}

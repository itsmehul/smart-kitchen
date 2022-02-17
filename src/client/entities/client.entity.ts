import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

@InputType('ClientInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Client extends CoreEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  apiKey: string;

  @Field(() => Date)
  @Column({ type: 'date' })
  expiry: Date;

  @Field(() => [Kitchen])
  @OneToMany(() => Kitchen, (kitchen) => kitchen.client)
  kitchens: Kitchen[];

  @BeforeInsert()
  async createApiKey(): Promise<void> {
    try {
      this.apiKey = Math.random().toString(36).substring(2, 22);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}

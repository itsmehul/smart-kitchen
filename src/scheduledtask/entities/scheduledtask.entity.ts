import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum TaskType {
  BOX = 'BOX',
}

@InputType('ScheduledtaskInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Scheduledtask extends CoreEntity {
  // For example the kitchen Id
  @Column({ type: 'json' })
  data: any;
  @Column({ type: 'datetime' })
  executionDateTime: Date;
  @Column()
  cronName: string;
  @Column({ type: 'enum', enum: TaskType })
  type: string;
}

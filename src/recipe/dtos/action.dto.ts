import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Action } from 'src/inventory/entities/action.entity';

@InputType()
export class CreateActionInput extends Action {}

@ObjectType()
export class CreateActionOutput extends CoreOutput {
  @Field(() => Action, { nullable: true })
  action?: Action;
}

@ObjectType()
export class BulkCreateActionOutput extends CoreOutput {
  @Field(() => Action, { nullable: true })
  actions?: Action[];
}

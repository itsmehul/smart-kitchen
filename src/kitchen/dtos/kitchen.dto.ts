import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Kitchen } from '../entities/kitchen.entity';

@InputType()
export class CreateKitchenInput extends PartialType(Kitchen) {}

@ObjectType()
export class CreateKitchenOutput extends CoreOutput {
  @Field(() => Kitchen, { nullable: true })
  kitchen?: Kitchen;
}

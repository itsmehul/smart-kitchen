import { Field, InputType } from '@nestjs/graphql';
import { Box } from '../entities/box.entity';

@InputType()
export class CreateBoxInput extends Box {}

@InputType()
export class InitiateBoxInput {
  @Field(() => String)
  kitchenId: string;
}

@InputType()
export class BoxIdsInput {
  @Field(() => [String])
  boxIds: string[];
}

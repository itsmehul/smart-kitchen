import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Station } from '../entities/station.entity';

@InputType()
export class CreateStationInput extends OmitType(Station, ['recipes']) {}

@ObjectType()
export class CreateStationOutput extends CoreOutput {
  @Field(() => Station, { nullable: true })
  station?: Station;
}

@ObjectType()
export class BulkCreateStationOutput extends CoreOutput {
  @Field(() => Station, { nullable: true })
  stations?: Station[];
}

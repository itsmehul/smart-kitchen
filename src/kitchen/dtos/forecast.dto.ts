import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Forecast } from '../entities/Forecast.entity';

@InputType()
export class CreateForecastInput extends Forecast {}

@ObjectType()
export class CreateForecastOutput extends CoreOutput {
  @Field(() => Forecast, { nullable: true })
  forecast?: Forecast;
}

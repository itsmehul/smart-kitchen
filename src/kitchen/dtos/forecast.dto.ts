import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Forecast } from '../entities/forecast.entity';

@InputType()
export class CreateForecastInput extends OmitType(Forecast, [
  'recipe',
  'remainingQty',
  'kitchen',
]) {}

@ObjectType()
export class CreateForecastOutput extends CoreOutput {
  @Field(() => Forecast, { nullable: true })
  forecast?: Forecast;
}

@ObjectType()
export class ForecastsOutput extends CoreOutput {
  @Field(() => [Forecast], { nullable: true })
  forecasts?: Forecast[];
}

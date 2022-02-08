import { InputType } from '@nestjs/graphql';
import { Bowl } from '../entities/bowl.entity';

@InputType()
export class CreateBowlInput extends Bowl {}

import { InputType } from '@nestjs/graphql';
import { Menu } from '../entities/menu.entity';

@InputType()
export class CreateMenuInput extends Menu {}

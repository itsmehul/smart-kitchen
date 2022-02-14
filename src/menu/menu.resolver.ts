import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateMenuInput } from './dtos/menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Mutation(() => CoreOutput)
  createOrder(@Args('input') input: CreateMenuInput): Promise<CoreOutput> {
    return this.menuService.createMenu(input);
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateIngredientOutput,
  CreateIngredientInput,
} from './dtos/ingredient.dto';
import { Action } from './entities/action.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Inventory } from './entities/inventory.entity';
import { InventoryService } from './inventory.service';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  // @Mutation(() => CreateShopOutput)
  // @Role(['Owner'])
  // async createShop(
  //   @AuthUser() authUser: User,
  //   @Args('input') createShopInput: CreateShopInput,
  // ): Promise<CreateShopOutput> {
  //   return this.shopService.createShop(authUser, createShopInput);
  // }

  // @Query(() => ShopOutput)
  // @Role(['Owner'])
  // getOwnersShop(@AuthUser() owner: User): Promise<ShopOutput> {
  //   return this.shopService.findShopById({ shopId: owner.shop.id });
  // }
}

@Resolver(() => Ingredient)
export class IngredientResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => CoreOutput)
  async createIngredient(
    @Args('input') input: CreateIngredientInput,
  ): Promise<CoreOutput> {
    this.inventoryService.createIngredient(input);
    return { ok: true };
  }

  @Mutation(() => BulkCreateIngredientOutput)
  async createBulkIngredient(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateIngredientInput] })
    input: CreateIngredientInput[],
  ): Promise<BulkCreateIngredientOutput> {
    return this.inventoryService.bulkCreateIngredient(input);
  }
}

@Resolver(() => Action)
export class ActionResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => BulkCreateActionOutput)
  async createBulkAction(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateActionInput] })
    input: CreateActionInput[],
  ): Promise<BulkCreateActionOutput> {
    return this.inventoryService.bulkCreateAction(input);
  }
}

import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB, SUB_EVENTS } from 'src/common/common.constants';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { BulkCreateActionOutput, CreateActionInput } from './dtos/action.dto';
import {
  BulkCreateIngredientOutput,
  CreateIngredientInput,
  IngredientsOutput,
  StockOutput,
} from './dtos/ingredient.dto';
import { Action } from './entities/action.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Inventory } from './entities/inventory.entity';
import { InventoryService } from './inventory.service';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  // @Mutation(() => CreateShopOutput)
  // @Role(['Manager'])
  // async createShop(
  //   @AuthUser() authUser: User,
  //   @Args('input') createShopInput: CreateShopInput,
  // ): Promise<CreateShopOutput> {
  //   return this.shopService.createShop(authUser, createShopInput);
  // }

  // @Query(() => ShopOutput)
  // @Role(['Manager'])
  // getManagersShop(@AuthUser() Manager: User): Promise<ShopOutput> {
  //   return this.shopService.findShopById({ shopId: Manager.shop.id });
  // }

  @Subscription(() => StockOutput, {
    resolve: ({
      recipeId,
      possibleStock,
    }: {
      recipeId: string;
      possibleStock: number;
    }) => {
      return { recipeId, possibleStock };
    },
  })
  // @Role(['Manager'])
  stockUpdates(): any {
    return this.pubSub.asyncIterator(SUB_EVENTS.UPDATED_STOCK);
  }
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
  createBulkIngredient(
    // @AuthUser() authUser: User,
    @Args({ name: 'input', type: () => [CreateIngredientInput] })
    input: CreateIngredientInput[],
  ): Promise<BulkCreateIngredientOutput> {
    return this.inventoryService.bulkCreateIngredient(input);
  }

  @Query(() => IngredientsOutput)
  getIngredients(): Promise<IngredientsOutput> {
    return this.inventoryService.getIngredients();
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

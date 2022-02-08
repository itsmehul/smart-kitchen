import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { BoxService } from 'src/delivery/box.service';
import { CreateForecastInput, ForecastsOutput } from './dtos/forecast.dto';
import { CreateKitchenInput, KitchenIdInput } from './dtos/Kitchen.dto';
import { PromoteRecipesInput, UpdateForecastInput } from './dtos/lane.dto';
import {
  CancelOrderInput,
  CreateOrderInput,
  OrdersOutput,
} from './dtos/order.dto';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/Kitchen.entity';
import { Lane } from './entities/lane.entity';
import { Order } from './entities/order.entity';
import { KitchenService } from './kitchen.service';
import { LaneService } from './lane.service';
import { OrderService } from './order.service';

@Resolver(() => Kitchen)
export class KitchenResolver {
  constructor(private readonly kitchenService: KitchenService) {}

  @Mutation(() => CoreOutput)
  async createKitchen(
    @Args('input') input: CreateKitchenInput,
  ): Promise<CoreOutput> {
    await this.kitchenService.createKitchen(input);
    return { ok: true };
  }
}

@Resolver(() => Forecast)
export class ForecastResolver {
  constructor(private readonly kitchenService: KitchenService) {}

  @Mutation(() => CoreOutput)
  createForecastOrder(
    @Args('input') input: CreateForecastInput,
  ): Promise<CoreOutput> {
    return this.kitchenService.createForecastedOrder(input);
  }

  @Query(() => ForecastsOutput)
  getForecasts(): Promise<ForecastsOutput> {
    return this.kitchenService.getForecasts();
  }
}

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly kitchenService: KitchenService,
    private readonly orderService: OrderService,
    private readonly boxService: BoxService,
  ) {}

  // @Mutation(() => CoreOutput)
  // createOrder(@Args('input') input: CreateOrderInput): Promise<CoreOutput> {
  //   return this.kitchenService.createOrder(input);
  // }

  @Mutation(() => CoreOutput)
  createOrder(@Args('input') input: CreateOrderInput): Promise<CoreOutput> {
    return this.orderService.createOrder(input);
  }

  @Mutation(() => CoreOutput)
  cancelOrder(@Args('input') input: CancelOrderInput): Promise<CoreOutput> {
    return this.orderService.cancelOrder(input);
  }

  @Query(() => OrdersOutput)
  async getAllOrdersReadyForBoxing(
    @Args('input') input: KitchenIdInput,
  ): Promise<OrdersOutput> {
    const orders = await this.boxService.getAllOrdersReadyForBoxing(
      input.kitchenId,
    );
    return { ok: true, orders };
  }
}

@Resolver(() => Lane)
export class LaneResolver {
  constructor(private readonly laneService: LaneService) {}

  @Mutation(() => CoreOutput)
  promoteRecipes(
    @Args('input') input: PromoteRecipesInput,
  ): Promise<CoreOutput> {
    return this.laneService.promoteRecipes(input);
  }

  @Mutation(() => CoreOutput)
  async addForecast(
    @Args('input') input: UpdateForecastInput,
  ): Promise<CoreOutput> {
    await this.laneService.addForecast(input);
    return {
      ok: true,
    };
  }
}

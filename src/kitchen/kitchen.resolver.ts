import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateForecastInput, ForecastsOutput } from './dtos/forecast.dto';
import { CreateKitchenInput } from './dtos/Kitchen.dto';
import { CreateOrderInput, ShiftOrderInput } from './dtos/order.dto';
import { Forecast } from './entities/forecast.entity';
import { Kitchen } from './entities/Kitchen.entity';
import { Order } from './entities/order.entity';
import { KitchenService } from './kitchen.service';

@Resolver(() => Kitchen)
export class KitchenResolver {
  constructor(private readonly kitchenService: KitchenService) {}

  @Mutation(() => CoreOutput)
  async createKitchen(
    @Args('input') input: CreateKitchenInput,
  ): Promise<CoreOutput> {
    this.kitchenService.createKitchen(input);
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
  constructor(private readonly kitchenService: KitchenService) {}

  @Mutation(() => CoreOutput)
  createOrder(@Args('input') input: CreateOrderInput): Promise<CoreOutput> {
    return this.kitchenService.createOrder(input);
  }

  @Mutation(() => CoreOutput, {
    description:
      'Promote real orders/forecasted orders through different stages of the system',
  })
  promoteOrders(@Args('input') input: ShiftOrderInput): Promise<CoreOutput> {
    return this.kitchenService.promoteOrders(input);
  }
}

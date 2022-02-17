import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { PUB_SUB, SUB_EVENTS } from 'src/common/common.constants';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { BoxService } from 'src/delivery/box.service';
import { BoxesToDeliverOutput } from 'src/delivery/dto/delivery.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateKitchenInput, KitchenIdInput } from './dtos/Kitchen.dto';
import { ShiftRecipeToLaneInput, UpdateForecastInput } from './dtos/lane.dto';
import {
  CancelOrderInput,
  CreateOrderInput,
  OrdersOutput,
  PackOrdersInput,
  PackOrderViaBowlInput,
} from './dtos/order.dto';
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

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly kitchenService: KitchenService,
    private readonly orderService: OrderService,
    private readonly boxService: BoxService,
  ) {}

  @Role(['Manager', 'Staff'])
  @Mutation(() => BoxesToDeliverOutput)
  async packOrders(
    @AuthUser() user: User,
    @Args('input') input: PackOrdersInput,
  ): Promise<BoxesToDeliverOutput> {
    const boxes = await this.orderService.packOrders(input, user.kitchenId);
    return { ok: true, boxes };
  }

  @Role(['Manager', 'Staff'])
  @Mutation(() => BoxesToDeliverOutput)
  async packOrdersViaBowl(
    @AuthUser() user: User,
    @Args('input') input: PackOrderViaBowlInput,
  ): Promise<BoxesToDeliverOutput> {
    const boxes = await this.orderService.packOrdersViaBowl(
      input,
      user.kitchenId,
    );
    return { ok: true, boxes };
  }

  @Role(['Manager', 'Staff'])
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
  constructor(
    private readonly laneService: LaneService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Role(['Manager'])
  @Mutation(() => CoreOutput)
  shiftRecipeToLane(
    @AuthUser() user: User,
    @Args('input') input: ShiftRecipeToLaneInput,
  ): Promise<CoreOutput> {
    return this.laneService.shiftRecipeToLane(input);
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

  @Subscription(() => Lane, {
    resolve: (lane) => {
      return lane;
    },
    filter: (payload, _, { user }) => {
      return payload.kitchenId === user.kitchenId;
    },
  })
  @Role(['Manager'])
  laneUpdates(): any {
    return this.pubSub.asyncIterator(SUB_EVENTS.MOVED_LANES);
  }
}

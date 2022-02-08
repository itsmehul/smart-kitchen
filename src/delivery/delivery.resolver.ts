import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { KitchenIdInput } from 'src/kitchen/dtos/Kitchen.dto';
import { User } from 'src/users/entities/user.entity';
import { entitiesToSave } from 'src/utils/misc';
import { BowlService } from './bowl.service';
import { BoxService } from './box.service';
import { DeliveryService } from './delivery.service';
import { CreateBowlInput } from './dto/bowl.dto';
import { BoxIdsInput, CreateBoxInput, InitiateBoxInput } from './dto/box.dto';
import { DeliveriesOutput } from './dto/delivery.dto';
import { Bowl } from './entities/bowl.entity';
import { Box } from './entities/box.entity';
import { Delivery } from './entities/delivery.entity';

@Resolver(() => Delivery)
export class DeliveryResolver {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Query(() => CoreOutput)
  async getAllOrdersReadyForDeliveryTest(
    @Args('input') input: KitchenIdInput,
  ): Promise<DeliveriesOutput> {
    const deliveries = await this.deliveryService.getAllOrdersReadyForDelivery(
      'a23a9685-f60c-4705-9503-5c4f9e21de64',
    );
    return {
      ok: true,
      // deliveries,
    };
  }
}

@Resolver(() => Box)
export class BoxResolver {
  constructor(private readonly boxService: BoxService) {}

  @Mutation(() => CoreOutput)
  async createBox(@Args('input') input: CreateBoxInput): Promise<CoreOutput> {
    const box = await this.boxService.createBoxEntity(input);

    await entitiesToSave([box]);

    return {
      ok: true,
    };
  }

  @Mutation(() => CoreOutput)
  async initiateBoxing(
    @Args('input') input: InitiateBoxInput,
  ): Promise<CoreOutput> {
    const boxesToSave = await this.boxService.initiateBoxing(input.kitchenId);

    await entitiesToSave([boxesToSave]);

    return {
      ok: true,
    };
  }

  @Mutation(() => CoreOutput)
  async deliverBoxes(
    @AuthUser() authUser: User,
    @Args('input') input: BoxIdsInput,
  ): Promise<CoreOutput> {
    await this.boxService.deliverBoxes(input.boxIds, authUser.kitchen);

    // await entitiesToSave([boxesToSave]);

    return {
      ok: true,
    };
  }

  @Query(() => CoreOutput)
  async getAllOrdersReadyForDelivery(
    @Args('input') input: KitchenIdInput,
  ): Promise<DeliveriesOutput> {
    const deliveries = await this.boxService.getAllOrdersReadyForDelivery(
      input.kitchenId,
    );
    return {
      ok: true,
      deliveries,
    };
  }
}

@Resolver(() => Bowl)
export class BowlResolver {
  constructor(private readonly bowlService: BowlService) {}

  @Mutation(() => CoreOutput)
  async createBowl(@Args('input') input: CreateBowlInput): Promise<CoreOutput> {
    const bowl = await this.bowlService.createBowlEntity(input);

    await entitiesToSave([bowl]);

    return {
      ok: true,
    };
  }
}

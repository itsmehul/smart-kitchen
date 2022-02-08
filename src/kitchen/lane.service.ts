import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { handleErrorResponse } from 'src/utils/misc';
import { Repository } from 'typeorm';
import {
  OrderActionType,
  OrderToLaneInput,
  PromoteRecipesInput,
  UpdateForecastInput,
} from './dtos/lane.dto';
import { Lane } from './entities/lane.entity';

@Injectable()
export class LaneService {
  constructor(
    @InjectRepository(Lane) private readonly lane: Repository<Lane>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getEntryForRecipeAndDate(
    recipeId: string,
    serviceDate: Date,
  ): Promise<Lane> {
    let lane = await this.lane.findOne({
      where: {
        recipe: { id: recipeId },
        serviceDate,
      },
    });
    if (!lane) {
      lane = await this.lane.create({
        recipe: {
          id: recipeId,
        },
        serviceDate,
        inKitchen: 0,
      });
    }
    return lane;
  }

  async addForecast(input: UpdateForecastInput): Promise<CoreOutput> {
    try {
      const lane = await this.getEntryForRecipeAndDate(
        input.recipeId,
        input.serviceDate,
      );

      if (lane.forecastedQty) {
        lane.remainingQty += input.forecastedQty - lane.forecastedQty;
        lane.inKitchen += input.forecastedQty - lane.forecastedQty;
        if (lane.remainingQty < 0) lane.remainingQty = 0;
      } else {
        if (lane.inKitchen) {
          lane.inKitchen += input.forecastedQty;
        } else {
          lane.inKitchen = input.forecastedQty;
        }
      }

      lane.forecastedQty = input.forecastedQty;
      lane.forecastedDate = DateTime.now().toJSDate();

      await this.lane.save(lane);
      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }

  async updateOrderedQtyToLane(input: OrderToLaneInput): Promise<Lane> {
    const lane = await this.getEntryForRecipeAndDate(
      input.recipeId,
      input.serviceDate,
    );

    if (lane.remainingQty && lane.remainingQty < input.orderedQty) {
      throw 'Not enough remaining qty';
    }

    if (input.action === OrderActionType.ADD) {
      if (lane.forecastedQty) {
        lane.remainingQty -= input.orderedQty;
      } else {
        lane.inKitchen += input.orderedQty;
      }
    } else {
      if (lane.forecastedQty) {
        if (lane.remainingQty < input.orderedQty) {
          lane.remainingQty += input.orderedQty - lane.remainingQty;
          lane.inKitchen += lane.remainingQty;
        }
      } else {
        if (lane.inKitchen < input.orderedQty) {
          throw 'Cannot cancel your order at this time';
        }
        lane.inKitchen -= input.orderedQty;
      }
    }

    return lane;
  }

  async promoteRecipes(input: PromoteRecipesInput): Promise<CoreOutput> {
    try {
      const lane = await this.getEntryForRecipeAndDate(
        input.recipeId,
        input.serviceDate,
      );

      const lanes = ['inKitchen', 'inProcessing', 'inComplete'];
      let laneIdx = 0;
      for (let i = 0; i < input.qty; i++) {
        if (lane[lanes[laneIdx]] === 0) {
          laneIdx++;
          if (laneIdx === lanes.length - 1) {
            break;
          }
        }
        lane[lanes[laneIdx]] -= 1;
        lane[lanes[laneIdx + 1]] += 1;
      }
      await this.lane.save(lane);
      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }
}

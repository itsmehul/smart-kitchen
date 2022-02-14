import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { handleErrorResponse } from 'src/utils/misc';
import { Repository } from 'typeorm';
import {
  Direction,
  OrderActionType,
  OrderToLaneInput,
  PromoteRecipesInput,
  ShiftRecipeToLaneInput,
  UpdateForecastInput,
} from './dtos/lane.dto';
import { Lane, LaneStatus } from './entities/lane.entity';

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
        inProcessing: 0,
        inKitchen: 0,
        inCompleted: 0,
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
        lane.inProcessing += input.orderedQty;
      }
    } else {
      if (lane.forecastedQty) {
        if (lane.remainingQty < input.orderedQty) {
          lane.remainingQty += input.orderedQty - lane.remainingQty;
          lane.inProcessing += lane.remainingQty;
        }
      } else {
        if (lane.inProcessing < input.orderedQty) {
          throw 'Cannot cancel at this moment';
        }
        lane.inProcessing -= input.orderedQty;
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

      const lanes = ['inKitchen', 'inProcessing', 'inCompleted'];
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

  async shiftRecipeToLane(input: ShiftRecipeToLaneInput): Promise<CoreOutput> {
    try {
      const lane = await this.getEntryForRecipeAndDate(
        input.recipeId,
        input.serviceDate,
      );

      if (
        (input.direction === Direction.RIGHT &&
          input.lane === LaneStatus.inCompleted) ||
        (input.direction === Direction.LEFT &&
          input.lane === LaneStatus.inProcessing)
      ) {
        throw 'Cannot shift recipe to this lane';
      }

      const lanes = ['inProcessing', 'inKitchen', 'inCompletes'];
      const fromIdx = lanes.indexOf(input.lane);
      let toIdx = fromIdx + 1;
      if (input.direction === Direction.LEFT) {
        toIdx = fromIdx - 1;
      }

      lane[fromIdx] = Math.max(lane[fromIdx] - input.qty, 0);
      lane[toIdx] = lane[toIdx] + input.qty;

      await this.lane.save(lane);
      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Unable to create order');
    }
  }
}

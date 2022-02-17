import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { Order } from 'src/kitchen/entities/order.entity';
import { Temperature } from 'src/recipe/entities/recipe.entity';
import { TiramizooService } from 'src/tiramizoo/tiramizoo.service';
import { In, IsNull, Repository } from 'typeorm';
import { Box } from './entities/box.entity';

type AvailableBoxes = Record<string, Record<number, Box[]>>;

@Injectable()
export class BoxService {
  constructor(
    @InjectRepository(Box) private readonly box: Repository<Box>,
    @InjectRepository(Order) private readonly order: Repository<Order>, //
    private readonly tiramizooService: TiramizooService,
  ) {}

  createBoxEntity(input: Box, kitchenId: string): Box {
    return this.box.create({
      ...input,
      kitchen: {
        id: kitchenId,
      },
    });
  }

  getAvailableBoxes(sizes: number[], type: Temperature): Promise<Box[]> {
    return this.box.find({
      where: {
        size: In(sizes),
        type,
      },
    });
  }

  async initiateBoxing(kitchenId: string): Promise<any> {
    const boxesToSave = [];

    const availableBoxes: AvailableBoxes = (
      await this.box.find({
        where: {
          kitchen: { id: kitchenId },
        },
        relations: ['orders'],
      })
    ).reduce((a, b) => {
      if (b.orders.length !== 0) {
        return a;
      }
      return {
        ...a,
        [b.type]: {
          ...a[b.type],
          [b.size]: a[b.type]?.[b.size] ? [...a[b.type][b.size], b] : [b],
        },
      };
    }, {});

    const ordersReadyForDelivery = await this.getAllOrdersReadyForBoxing(
      kitchenId,
    );

    const ordersGroupedByExternalIdAndType: Record<
      string,
      Record<string, Order[]>
    > = ordersReadyForDelivery.reduce((a, b) => {
      return {
        ...a,
        [b.delivery.external_id]: {
          ...a[b.delivery.external_id],
          [b.recipe.type]: a[b.delivery.external_id]?.[b.recipe.type]
            ? [...a[b.delivery.external_id][b.recipe.type], b]
            : [b],
        },
      };
    }, {});

    for (const { Hot, Cold } of Object.values(
      ordersGroupedByExternalIdAndType,
    )) {
      getRequiredBoxes(Cold, availableBoxes.Cold);
      getRequiredBoxes(Hot, availableBoxes.Hot);
    }

    function getRequiredBoxes(orders: any[], availableBoxesInType: any): any {
      if (!availableBoxesInType || !orders) {
        return;
      }
      let noOfOrdersToPack = orders.length;
      const availableBoxSizeOptions = Object.keys(availableBoxesInType)
        .map((num) => Number(num))
        .sort((a, b) => b - a);

      let noOfAvailableBoxesInType =
        Object.values(availableBoxesInType).flat().length;

      // Keep iterating while there are orders to pack
      while (noOfOrdersToPack > 0) {
        let noOfBoxesOfSizeNeeded;
        let selectedBox;
        // Iterate through the available box sizes
        for (const availableBoxSizeOption of availableBoxSizeOptions) {
          // Check if there are any boxes of the current size
          if (0 < availableBoxesInType[availableBoxSizeOption].length) {
            // Check if the available size overlaps the leftover quantity and
            // If the current box selection is less than available size
            if (
              noOfOrdersToPack - availableBoxSizeOption < 0 &&
              (!selectedBox || availableBoxSizeOption < selectedBox)
            ) {
              noOfBoxesOfSizeNeeded = 1;
              selectedBox = availableBoxSizeOption;
              continue;
            }

            // Get the number of boxes needed to pack the current order with the current size
            let needed = Math.floor(noOfOrdersToPack / availableBoxSizeOption);

            // Swap if current number of boxes required is more than the needed number of boxes
            if (
              !noOfBoxesOfSizeNeeded ||
              (needed < noOfBoxesOfSizeNeeded && needed > 1)
            ) {
              if (
                needed > availableBoxesInType[availableBoxSizeOption].length
              ) {
                needed = availableBoxesInType[availableBoxSizeOption].length;
              }
              noOfBoxesOfSizeNeeded = needed;
              selectedBox = availableBoxSizeOption;
              continue;
            }
          }
        }
        // Reduce orders to pack as per box selection along with quanity of boxes
        noOfOrdersToPack -= noOfBoxesOfSizeNeeded * selectedBox;
        noOfAvailableBoxesInType -= noOfBoxesOfSizeNeeded;
        // Adjust if negative
        if (noOfOrdersToPack < 0) {
          noOfOrdersToPack = 0;
        }

        // Take out number of boxes needed
        const boxNeeded = availableBoxesInType[selectedBox].splice(
          0,
          noOfBoxesOfSizeNeeded,
        );

        // Assign above boxes to orders
        for (const box of boxNeeded) {
          const ordersToBox = orders.splice(0, selectedBox);
          box.orders = ordersToBox;
          boxesToSave.push(box);
        }

        if (noOfAvailableBoxesInType === 0) {
          console.log('Not enough boxes available for', orders);
          break;
        }
      }
    }

    return boxesToSave;
  }

  getAllOrdersReadyForBoxing(kitchenId: string): Promise<Order[]> {
    return this.order.find({
      where: {
        // status: OrderStatus.inCompleted,
        box: IsNull(),
        kitchen: {
          id: kitchenId,
        },
        // delivery: {
        //   deliveryDateTime: Between(
        //     DateTime.now().plus({ minute: 105 }).toJSDate(),
        //     DateTime.now().plus({ hour: 2 }).toJSDate(),
        //   ),
        // },
      },
      relations: ['delivery', 'recipe'],
    });
  }

  async getAllOrdersReadyForDelivery(kitchenId: string): Promise<Box[][]> {
    return Object.values(
      (
        await this.box.find({
          where: (qb) => {
            qb.where({
              kitchen: {
                id: kitchenId,
              },
            }).andWhere(
              'EXISTS (SELECT * FROM `order` o where o.boxId = box.id)',
            );
          },
          relations: ['orders', 'orders.delivery', 'orders.recipe'],
        })
      ).reduce((a, b) => {
        if (b.orders.length === 0) {
          return a;
        }
        return {
          ...a,
          [b.orders[0].delivery.external_id]: [
            ...(a[b.orders?.[0]?.delivery?.external_id] || []),
            b,
          ],
        };
      }, {}),
    );
  }

  async deliverBoxes(boxIds: string[], kitchen: Kitchen): Promise<any> {
    const boxes = await this.box.find({
      where: {
        id: In(boxIds),
        kitchen: {
          id: kitchen.id,
        },
      },
      relations: ['orders', 'orders.delivery', 'orders.recipe'],
    });

    // this.tiramizooService.createOrder(
    //   kitchen,
    //   boxes[0].orders[0].delivery,
    //   boxes,
    // );
  }
}

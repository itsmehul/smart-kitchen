import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/common.constants';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryListener {
  constructor(private readonly inventoryService: InventoryService) {}

  @OnEvent(EVENTS.ORDERS_IN_PROCESSING)
  handleOrderCompletionForGroup({
    recipeId,
    orderedQty,
    kitchenId,
  }: {
    recipeId: string;
    orderedQty: number;
    kitchenId: string;
  }) {
    this.inventoryService.reduceStockForRecipe(recipeId, orderedQty, kitchenId);
    //create Inventory and boxes for all orders
  }
}

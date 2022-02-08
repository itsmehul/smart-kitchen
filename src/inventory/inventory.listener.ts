import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/common.constants';
import { ArithmeticOperator } from 'src/common/common.interfaces';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryListener {
  constructor(private readonly inventoryService: InventoryService) {}

  // @OnEvent(EVENTS.ORDERS_IN_PROCESSING)
  // handleOrderCompletionForGroup({
  //   recipeId,
  //   orderedQty,
  //   kitchenId,
  // }: {
  //   recipeId: string;
  //   orderedQty: number;
  //   kitchenId: string;
  // }) {
  //   this.inventoryService.updateStockForRecipe(
  //     recipeId,
  //     orderedQty,
  //     kitchenId,
  //     'SUBTRACT',
  //   );
  //   //create Inventory and boxes for all orders
  // }

  @OnEvent(EVENTS.PLACE_ORDER)
  placeOrder({
    recipeId,
    orderedQty,
    kitchenId,
  }: {
    recipeId: string;
    orderedQty: number;
    kitchenId: string;
    operation: ArithmeticOperator;
  }) {
    this.inventoryService.updateStockForRecipe(
      recipeId,
      orderedQty,
      kitchenId,
      ArithmeticOperator.SUBTRACT,
    );
  }

  @OnEvent(EVENTS.CANCEL_ORDER)
  cancelOrder({
    recipeId,
    orderedQty,
    kitchenId,
  }: {
    recipeId: string;
    orderedQty: number;
    kitchenId: string;
    operation: ArithmeticOperator;
  }) {
    this.inventoryService.updateStockForRecipe(
      recipeId,
      orderedQty,
      kitchenId,
      ArithmeticOperator.ADD,
    );
  }
}

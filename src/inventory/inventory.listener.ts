import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PubSub } from 'graphql-subscriptions';
import { EVENTS, PUB_SUB, SUB_EVENTS } from 'src/common/common.constants';

@Injectable()
export class InventoryListener {
  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {}

  @OnEvent(EVENTS.UPDATED_STOCK)
  async handleOrderCompletionForGroup({
    recipeId,
    possibleStock,
  }: {
    recipeId: string;
    possibleStock: number;
  }) {
    await this.pubSub.publish(SUB_EVENTS.UPDATED_STOCK, {
      recipeId,
      possibleStock,
    });
  }
}

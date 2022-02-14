import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { PubSub } from 'graphql-subscriptions';
import { EVENTS, PUB_SUB } from 'src/common/common.constants';

@Injectable()
export class MenuListener {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @OnEvent(EVENTS.UPDATED_STOCK)
  async updateCachedMenuWithStock({
    recipeId,
    possibleStock,
  }: {
    recipeId: string;
    possibleStock: number;
  }) {
    // const value = await this.cacheManager.get('key');
    // await this.pubSub.publish(SUB_EVENTS.UPDATED_STOCK, {
    //   recipeId,
    //   possibleStock,
    // });
  }
}

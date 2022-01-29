import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiramizooPackage } from './entities/package.entity';
import { TiramizooOrder } from './entities/tiramizoo.entity';

//FIXME: Fetch time windows from tiramizoo API

@Injectable()
export class TiramizooService {
  constructor(
    @InjectRepository(TiramizooPackage)
    private readonly packageRepository: TiramizooPackage,
    @InjectRepository(TiramizooOrder)
    private readonly orderRepository: TiramizooOrder,
  ) {}

  // async createOrder(): Promise<CoreOutput> {}

  // async cancelOrder(): Promise<CoreOutput> {}
}

import { DynamicModule, Module } from '@nestjs/common';
import { TiramizooService } from './tiramizoo.service';
import { TiramizooResolver } from './tiramizoo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiramizooPackage } from './entities/package.entity';
import { TiramizooOrder } from './entities/tiramizoo.entity';
import { TiramizooConfig } from './tiramizoo.interface';
import {
  TIRAMIZOO_URL,
  TIRAMIZOO_WEBHOOK_URL,
} from 'src/common/common.constants';

@Module({})
export class TiramizooModule {
  static forRoot(config: TiramizooConfig): DynamicModule {
    return {
      module: TiramizooModule,
      imports: [TypeOrmModule.forFeature([TiramizooPackage, TiramizooOrder])],
      providers: [
        {
          provide: TIRAMIZOO_URL,
          useValue: config.tiramizooUrl + config.apiKey,
        },
        {
          provide: TIRAMIZOO_WEBHOOK_URL,
          useValue: config.tiramizooWebhookUrl,
        },
        TiramizooResolver,
        TiramizooService,
      ],
      exports: [TiramizooService],
      global: true,
    };
  }
}

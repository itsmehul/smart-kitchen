import { Module } from '@nestjs/common';
import { TiramizooService } from './tiramizoo.service';
import { TiramizooResolver } from './tiramizoo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiramizooPackage } from './entities/package.entity';
import { TiramizooOrder } from './entities/tiramizoo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiramizooPackage, TiramizooOrder])],
  providers: [TiramizooResolver, TiramizooService],
  exports: [
    // RecipeService
  ],
})
export class TiramizooModule {}

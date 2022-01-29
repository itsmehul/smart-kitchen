import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  providers: [
    // RecipeService,
  ],
  exports: [
    // RecipeService
  ],
})
export class MenuModule {}

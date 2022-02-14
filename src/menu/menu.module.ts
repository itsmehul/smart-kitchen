import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuDish } from './entities/menuDish.entity';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuDish])],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}

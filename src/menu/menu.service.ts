import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import { CreateMenuInput } from './dtos/menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menu: Repository<Menu>,
  ) {}

  async createMenu(input: CreateMenuInput): Promise<CoreOutput> {
    const menu = this.menu.create(input);

    await this.menu.save(menu);
    return { ok: true };
  }
}

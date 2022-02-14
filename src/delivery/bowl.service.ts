import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Bowl } from './entities/bowl.entity';

@Injectable()
export class BowlService {
  constructor(
    @InjectRepository(Bowl) private readonly bowl: Repository<Bowl>,
  ) {}

  createBowlEntity(input: Bowl): Bowl {
    return this.bowl.create({
      ...input,
      kitchen: {
        id: input.kitchenId,
      },
    });
  }

  getBowlIfEmpty(id: string): Promise<Bowl> {
    return this.bowl.findOne({ where: { id, order: Not(IsNull()) } });
  }
}

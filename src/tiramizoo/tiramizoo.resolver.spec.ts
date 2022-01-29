import { Test, TestingModule } from '@nestjs/testing';
import { TiramizooResolver } from './tiramizoo.resolver';
import { TiramizooService } from './tiramizoo.service';

describe('TiramizooResolver', () => {
  let resolver: TiramizooResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiramizooResolver, TiramizooService],
    }).compile();

    resolver = module.get<TiramizooResolver>(TiramizooResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

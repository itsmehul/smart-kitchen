import { Test, TestingModule } from '@nestjs/testing';
import { TiramizooService } from './tiramizoo.service';

describe('TiramizooService', () => {
  let service: TiramizooService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiramizooService],
    }).compile();

    service = module.get<TiramizooService>(TiramizooService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

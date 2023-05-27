import { Test, TestingModule } from '@nestjs/testing';
import { WishesServiceService } from './wishes-service.service';

describe('WishesServiceService', () => {
  let service: WishesServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishesServiceService],
    }).compile();

    service = module.get<WishesServiceService>(WishesServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

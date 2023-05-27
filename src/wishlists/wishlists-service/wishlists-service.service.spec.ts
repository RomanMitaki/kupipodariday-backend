import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsServiceService } from './wishlists-service.service';

describe('WishlistsServiceService', () => {
  let service: WishlistsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistsServiceService],
    }).compile();

    service = module.get<WishlistsServiceService>(WishlistsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

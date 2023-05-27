import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsControllerController } from './wishlists-controller.controller';

describe('WishlistsControllerController', () => {
  let controller: WishlistsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsControllerController],
    }).compile();

    controller = module.get<WishlistsControllerController>(WishlistsControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

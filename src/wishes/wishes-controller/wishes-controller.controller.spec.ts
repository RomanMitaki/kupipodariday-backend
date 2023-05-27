import { Test, TestingModule } from '@nestjs/testing';
import { WishesControllerController } from './wishes-controller.controller';

describe('WishesControllerController', () => {
  let controller: WishesControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishesControllerController],
    }).compile();

    controller = module.get<WishesControllerController>(WishesControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

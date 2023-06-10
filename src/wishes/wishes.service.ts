import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    delete owner.password;
    delete owner.email;
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return this.wishesRepository.save(wish);
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    return wish;
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async updateOne(wishId: number, UpdatedWish: UpdateWishDto, userId: number) {
    const wish = await this.findOne(wishId);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Это не ваше желание');
    }
    if (wish.raised !== 0 && wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Желание уже исполняется и его нельзя изменить',
      );
    }
    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    return await this.wishesRepository.update(wishId, UpdatedWish);
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Это не ваше желание');
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Это желание уже в вашем списке');
    }
    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const copiedWish = {
      ...wish,
      raised: 0,
      owner: user.id,
      offers: [],
    };
    delete copiedWish.id;
    delete copiedWish.createdAt;
    delete copiedWish.updatedAt;
    await this.create(user, copiedWish);
    return {};
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(owner: User, createWishListDto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;
    const wishes = await this.wishesService.findMany({});
    const items = createWishListDto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });
    const wishList = this.wishlistsRepository.create({
      ...createWishListDto,
      owner: owner,
      items: items,
    });
    return this.wishlistsRepository.save(wishList);
  }
}

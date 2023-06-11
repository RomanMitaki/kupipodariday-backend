import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

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

  async findMany() {
    const wishlists = await this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    return wishlists.map((wishlist) => {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
      return wishlist;
    });
  }

  async findWishlistById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    delete wishlist.owner.password;
    delete wishlist.owner.email;
    return wishlist;
  }

  async updateOne(
    user: User,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findWishlistById(wishlistId);
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Это не ваша коллекция');
    }
    await this.wishlistsRepository.update(wishlistId, updateWishlistDto);
    const updatedWishList = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    delete updatedWishList.owner.password;
    delete updatedWishList.owner.email;
    return updatedWishList;
  }
}

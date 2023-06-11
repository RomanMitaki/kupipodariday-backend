import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Это ваше желание');
    }
    const sum = Number(wish.raised) + Number(createOfferDto.amount);
    if (sum > wish.price) {
      throw new ForbiddenException(
        'Сумма для исполнения превышает стоимость желания',
      );
    }

    wish.raised = sum;
    await this.wishesService.updateSum(wish.id, wish.raised);

    const offer = await this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    delete offer.user.password;
    delete offer.user.email;
    delete offer.item.owner.password;
    delete offer.item.owner.email;

    if (!offer.hidden) {
      delete offer.user.username;
    }

    return await this.offersRepository.save(offer);
  }

  async findMany() {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });
    if (offers.length === 0) {
      throw new NotFoundException('Предложений не найдено');
    }
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.find({
      where: { id },
      relations: ['item', 'user'],
    });
    if (offer.length === 0) {
      throw new NotFoundException('Предложений не найдено');
    }
    return offer;
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishList.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Post()
  async create(@Body() createWishListDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user, createWishListDto);
  }
}

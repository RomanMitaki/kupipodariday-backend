import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishList.dto';
import { WishlistsService } from './wishlists.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists() {
    return await this.wishlistsService.findMany();
  }

  @Get(':id')
  async getWishlistById(@Param('id') id: string) {
    return await this.wishlistsService.findWishlistById(+id);
  }

  @Post()
  async create(@Body() createWishListDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user, createWishListDto);
  }

  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateOne(req.user, +id, updateWishlistDto);
  }
}

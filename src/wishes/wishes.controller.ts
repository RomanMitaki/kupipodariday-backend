import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  async getTopWishes() {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  async getWishById(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }

  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(req.user, createWishDto);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user);
  }

  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updatedWish: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(+id, updatedWish, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.wishesService.remove(id, req.user.id);
  }
}

import {
  Controller,
  Patch,
  Body,
  Post,
  Req,
  Get,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { FindUsersDto } from './dto/find-users.dto';
import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('me')
  updateOne(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me')
  getOwn(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    delete user.password;
    delete user.email;
    return user;
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.getWishes(req.user.id);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.getUserByName(username);
    return this.usersService.getWishes(user.id);
  }

  @Post('find')
  async findMany(@Body() findUser: FindUsersDto) {
    return await this.usersService.findMany(findUser);
  }
}

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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { FindUsersDto } from './dto/find-users.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

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

  @Post('find')
  async findUsers(@Body() findUser: FindUsersDto) {
    return await this.usersService.findUsers(findUser);
  }
}

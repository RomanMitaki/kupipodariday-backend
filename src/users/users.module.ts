import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Wish } from '../wishes/entities/wish.entity';
import { HashModule } from '../auth/hash/hash.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), HashModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

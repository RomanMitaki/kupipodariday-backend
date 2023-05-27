import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users-module/users.module';
import { WishesModule } from './wishes/wishes-module/wishes.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';

@Module({
  imports: [
    UsersModule,
    WishesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [User, Wish],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users-module/users.module';
import { WishesModule } from './wishes/wishes-module/wishes.module';
import { WishlistsModule } from './wishlists/wishlists-module/wishlists.module';
import { OffersModule } from './offers/offers-module/offers.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';

@Module({
  imports: [
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from './hash/hash.service';
import { HashModule } from './hash/hash.module';

@Module({
  providers: [AuthService, HashService],
  controllers: [AuthController],
  imports: [HashModule]
})
export class AuthModule {}

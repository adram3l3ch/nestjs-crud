import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { User } from './entities/user.entity.js';
import { RolesGuard } from './guards/roles.guard.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { LoginThrottlerGuard } from './guards/login-throttler.guard.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, LoginThrottlerGuard],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
  ],
  exports: [RolesGuard],
})
export class AuthModule {}

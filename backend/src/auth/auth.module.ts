import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from 'src/utils/constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env[JWT.SECRET],
      signOptions: { expiresIn: '1d' }
    })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }

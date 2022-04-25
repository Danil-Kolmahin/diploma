import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10),
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService, PassportModule],
})
export class AuthModule {
}

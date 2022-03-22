import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from '../../environments/environment';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {
  }

  async generateHash(password: string): Promise<string> {
    return this.passwordService.getHash(password);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<UsersEntity, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);
    const isValid = user
      ? await this.passwordService.compareHash(pass, user.password)
      : false;
    if (isValid) {
      delete user.password;

      return user;
    }
    return null;
  }

  async login(signInPayload) {
    const user = await this.validateUser(
      signInPayload.email,
      signInPayload.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, userId: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: new Date(environment.jwt.expiresIn).getDate(),
      id: user.id,
    };
  }
}

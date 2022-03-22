import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {
  }

  async getHash(password: string): Promise<string> {
    return this.passwordService.getHash(password);
  }

  async login(signInPayload) {
    const user = await this.usersService.findOneByEmail(signInPayload.email);
    if (!user) throw new UnauthorizedException();

    const isValid = await this.passwordService.compareHash(
      signInPayload.password, user.password,
    );
    if (!isValid) throw new UnauthorizedException();

    return this.jwtService.sign({ email: user.email, id: user.id });
  }
}

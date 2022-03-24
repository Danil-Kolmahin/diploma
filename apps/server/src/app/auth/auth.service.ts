import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {
  }

  async getHash(password: string): Promise<string> {
    return hash(password, parseInt(process.env.JWT_SALT_ROUNDS, 10))
  }

  async compareHash(
    candidatePassword: string, passwordHash: string
  ): Promise<boolean> {
    return compare(candidatePassword, passwordHash);
  }

  async generateToken(payload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async parseToken(token: string): Promise<unknown> {
    return this.jwtService.decode(token);
  }
}

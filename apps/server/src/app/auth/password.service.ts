import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds = parseInt(process.env.JWT_SALT_ROUNDS, 10);

  getHash(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  compareHash(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  }
}

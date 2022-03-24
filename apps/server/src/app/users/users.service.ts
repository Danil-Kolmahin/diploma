import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntity } from '../common/common.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly authService: AuthService,
  ) {
  }

  async findOneById(id: string): Promise<UsersEntity | undefined> {
    return this.usersRepository.findOne({ id });
  }

  async findOneByEmail(email: string): Promise<UsersEntity | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async createOne(user: Omit<UsersEntity, keyof CommonEntity>): Promise<UsersEntity> {
    let savedUser;
    try {
      savedUser = await this.usersRepository.save(user);
    } catch (e) {
      if (e.code === '23505') throw new ConflictException();
      throw e;
    }
    return savedUser;
  }

  async login(signInPayload) {
    const user = await this.findOneByEmail(signInPayload.email);
    if (!user) throw new UnauthorizedException();

    const isValid = await this.authService.compareHash(
      signInPayload.password, user.password,
    );
    if (!isValid) throw new UnauthorizedException();

    return this.authService.generateToken({ email: user.email, id: user.id });
  }
}

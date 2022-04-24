import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntity } from '../common/common.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  public readonly DEFAULT_SYSTEM_USER_ID = '68ee28ff-3259-430c-a96f-522d87e8e289';
  public DEFAULT_OFFICIAL_USER: UsersEntity;

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly authService: AuthService,
  ) {
    this.createSystemUser().then();
  }

  private async createSystemUser(): Promise<void> {
    this.DEFAULT_OFFICIAL_USER = await this.usersRepository.save({
      id: this.DEFAULT_SYSTEM_USER_ID,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      email: 'copyleft.68ee28ff@gmail.com',
      password: '$2b$10$mt8KH3oxyccd40vZdGwmX.XaGefNgcfPpm9oKXRX4H1OEnBN2J9Vi', // DEFAULT_SYSTEM_USER_ID
    });
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

import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntity } from '../common/common.entity';

@Injectable()
export class UsersService {
  public readonly DEFAULT_SYSTEM_USER_ID = '68ee28ff-3259-430c-a96f-522d87e8e289';
  public DEFAULT_OFFICIAL_USER: UsersEntity;

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
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

  async createOne(user: Omit<UsersEntity, keyof CommonEntity>): Promise<UsersEntity | never> {
    return this.usersRepository.save(user);
  }
}

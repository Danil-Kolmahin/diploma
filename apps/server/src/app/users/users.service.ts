import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntity } from '../common/common.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {
  }

  async findOneById(id: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ id });
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async createOne(user: Omit<UsersEntity, keyof CommonEntity>): Promise<UsersEntity> {
    return this.usersRepository.save(user);
  }
}

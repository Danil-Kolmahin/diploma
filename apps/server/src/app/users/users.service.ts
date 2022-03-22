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
    // let savedUser;
    // try {
    //   savedUser = await this.usersRepository.save(user);
    // } catch (e) {
    //   if (e.code === '23505')
    //     throw new HttpException(
    //       'Something is not correct', HttpStatus.BAD_REQUEST,
    //     ); // Key (email)=(test@email.com) already exists.
    //   throw e;
    // }
    // return savedUser;
    return this.usersRepository.save(user);
  }
}

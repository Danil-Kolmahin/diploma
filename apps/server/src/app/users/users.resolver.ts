import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

@ArgsType()
class CreateUserArgs implements Omit<UsersEntity, keyof CommonEntity> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@Resolver('users')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Query(() => UsersEntity, { nullable: true })
  async findUserById(@Args('id') id: string): Promise<UsersEntity | undefined> {
    return this.usersService.findOneById(id);
  }

  @Query(() => [UsersEntity])
  async findAllUsers(): Promise<UsersEntity[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => UsersEntity)
  async createUser(@Args('', new ValidationPipe()) user: CreateUserArgs): Promise<UsersEntity> {
    return this.usersService.createOne(user);
  }
}

import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver('users')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Query(() => UsersEntity, { nullable: true })
  async findOneById(@Args('id') id: string): Promise<UsersEntity | null> {
    return this.usersService.findOneById(id);
  }

  @Query(() => [UsersEntity])
  async findAll(): Promise<UsersEntity[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => UsersEntity)
  async createOne(@Args('user') user: CreateUserInput): Promise<UsersEntity> {
    return this.usersService.createOne(user);
  }
}

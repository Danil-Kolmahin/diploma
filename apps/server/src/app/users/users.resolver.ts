import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Authorization, GqlAuthGuard } from '../auth/gql.auth-guard';
import { AuthService } from '../auth/auth.service';

@ArgsType()
class BaseUserArgs implements Omit<UsersEntity, keyof CommonEntity> {
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
    private readonly authService: AuthService,
  ) {
  }

  @Query(() => UsersEntity, { nullable: true })
  async findUserById(@Args('id') id: string): Promise<UsersEntity | undefined> {
    return this.usersService.findOneById(id);
  }

  @Query(() => [UsersEntity])
  @UseGuards(GqlAuthGuard)
  async findAllUsers(@Authorization() auth): Promise<UsersEntity[]> {
    console.log(auth);
    return this.usersService.findAll();
  }

  @Mutation(() => UsersEntity)
  async createUser(@Args('', new ValidationPipe()) user: BaseUserArgs): Promise<UsersEntity> {
    const modifiedUser = Object.assign(user, {
      password: await this.authService.getHash(user.password),
    });
    return this.usersService.createOne(modifiedUser);
  }

  @Query(() => String)
  async login(@Args() userArgs: BaseUserArgs): Promise<string> {
    return this.authService.login(userArgs);
  }

  // @Query(() => Boolean)
  // async logout(): Promise<boolean> {
  //   return true;
  // }
}

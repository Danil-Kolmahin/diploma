import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Auth, GqlAuthGuard, GQLRequest } from '../auth/gql.auth-guard';
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
  async findAllUsers(): Promise<UsersEntity[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => UsersEntity)
  async createUser(@Args('', new ValidationPipe()) user: BaseUserArgs): Promise<UsersEntity> {
    const modifiedUser = Object.assign(user, {
      password: await this.authService.getHash(user.password),
    });
    return this.usersService.createOne(modifiedUser);
  }

  @Query(() => Boolean)
  async login(
    @Args('', new ValidationPipe()) userArgs: BaseUserArgs,
    @GQLRequest() request,
  ): Promise<true | never> {
    const token = await this.usersService.login(userArgs);
    request.res.cookie(process.env.NX_AUTH_COOKIE_NAME, token);
    return true;
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@Auth() auth, @GQLRequest() request): Promise<true> {
    request.res.clearCookie(process.env.NX_AUTH_COOKIE_NAME);
    return true;
  }
}

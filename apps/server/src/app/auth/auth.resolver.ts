import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard, GQLRequest } from './gql.auth-guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';

@ArgsType()
class BaseUserArgs implements Omit<UsersEntity, keyof CommonEntity> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
  }

  @Mutation(() => Boolean)
  async login(
    @Args('', new ValidationPipe()) userArgs: BaseUserArgs,
    @GQLRequest() request,
  ): Promise<true | never> {
    const user = await this.usersService.findOneByEmail(userArgs.email);
    if (!user) throw new UnauthorizedException();
    const isValid = await this.authService.compareHash(
      userArgs.password, user.password,
    );
    if (!isValid) throw new UnauthorizedException();
    const token = await this.authService.generateToken({ email: user.email, id: user.id });
    request.res.cookie(process.env.NX_AUTH_COOKIE_NAME, token);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@GQLRequest() request): Promise<true> {
    request.res.clearCookie(process.env.NX_AUTH_COOKIE_NAME);
    return true;
  }
}

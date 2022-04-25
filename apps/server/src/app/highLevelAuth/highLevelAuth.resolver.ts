import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ConflictException, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';
import { BASE_CHROMOSOME } from '@diploma-v2/common/constants-common';
import { RobotsService } from '../robots/robots.service';
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

@Resolver()
export class HighLevelAuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly robotsService: RobotsService,
    private readonly usersService: UsersService,
  ) {
  }

  @Mutation(() => UsersEntity)
  async signUp(@Args('', new ValidationPipe()) user: BaseUserArgs): Promise<UsersEntity> {
    let savedUser;
    try {
      savedUser = await this.usersService.createOne(Object.assign(user, {
        password: await this.authService.getHash(user.password),
      }));
      await this.robotsService.createOne({
        body: BASE_CHROMOSOME, createdBy: savedUser, growable: true, name: 'Default',
      });
    } catch (e) {
      if (e.code === '23505') throw new ConflictException();
      throw e;
    }
    return savedUser;
  }
}

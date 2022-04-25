import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RobotsService } from './robots.service';
import { RobotsEntity } from './robots.entity';
import { CommonCreatedEntity } from '../common/common.entity';
import { Auth, GqlAuthGuard } from '../auth/gql.auth-guard';
import { CookieTokenDataI, RobotsChromosome } from '@diploma-v2/common/constants-common';
import { UsersService } from '../users/users.service';
import { GraphQLJSON } from 'graphql-type-json';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { IsJSON } from 'class-validator';

@ArgsType()
class RobotArgs implements Omit<RobotsEntity, keyof CommonCreatedEntity> {
  @Field(() => GraphQLJSON)
  @IsJSON()
  body: RobotsChromosome;

  @Field()
  growable: boolean;

  @Field()
  name: string;
}

@Resolver()
export class RobotsResolver {
  constructor(
    private readonly robotsService: RobotsService,
    private readonly usersService: UsersService,
  ) {
  }

  @Query(() => [RobotsEntity], { nullable: 'items' })
  @UseGuards(GqlAuthGuard)
  async findAllRobots(@Auth() auth: CookieTokenDataI): Promise<RobotsEntity[]> {
    const user = await this.usersService.findOneById(auth.id);
    return this.robotsService.findAll(user);
  }

  @Mutation(() => RobotsEntity)
  @UseGuards(GqlAuthGuard)
  async createRobot(
    @Args('', new ValidationPipe()) robot: RobotArgs,
    @Auth() auth: CookieTokenDataI,
  ): Promise<RobotsEntity> {
    const user = await this.usersService.findOneById(auth.id);
    return this.robotsService.createOne({ ...robot, createdBy: user });
  }
}

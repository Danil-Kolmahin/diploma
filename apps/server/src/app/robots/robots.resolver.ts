import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RobotsService } from './robots.service';
import { RobotsEntity } from './robots.entity';
import { CommonCreatedEntity } from '../common/common.entity';
import { Auth } from '../auth/gql.auth-guard';
import { CookieTokenDataI, RobotsChromosome } from '@diploma-v2/common/constants-common';
import { UsersService } from '../users/users.service';
import { GraphQLJSON } from 'graphql-type-json';
import { ValidationPipe } from '@nestjs/common';

@ArgsType()
class RobotArg implements Omit<RobotsEntity, keyof CommonCreatedEntity> {
  @Field(() => GraphQLJSON)
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

  @Query(() => [RobotsEntity])
  async findAllRobots(): Promise<RobotsEntity[]> {
    return this.robotsService.findAll();
  }

  @Mutation(() => RobotsEntity)
  async createRobot(
    @Args('', new ValidationPipe()) robot: RobotArg,
    @Auth() auth: CookieTokenDataI,
  ): Promise<RobotsEntity> {
    const user = await this.usersService.findOneById(auth.id);
    return this.robotsService.createOne({ ...robot, createdBy: user });
  }
}

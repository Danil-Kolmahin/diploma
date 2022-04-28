import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RobotsService } from './robots.service';
import { RobotsEntity } from './robots.entity';
import { Auth, GqlAuthGuard } from '../auth/gql.auth-guard';
import { CookieTokenDataI } from '@diploma-v2/common/constants-common';
import { UsersService } from '../users/users.service';
import { GraphQLJSON } from 'graphql-type-json';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { IsJSON } from 'class-validator';
import { BaseIdArgs } from '../common/common.resolver';

@ArgsType()
class RobotArgs {
  @Field(() => GraphQLJSON)
  @IsJSON()
  body: string; // TODO auto convert to object

  @Field()
  growable: boolean;

  @Field()
  name: string;
}

@ArgsType()
class RobotOptionalArgs {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsJSON()
  body?: string;

  @Field({ nullable: true })
  growable?: boolean;

  @Field({ nullable: true })
  name?: string;
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
    return this.robotsService.createOne({
      ...robot,
      createdBy: user,
      body: JSON.parse(robot.body),
    });
  }

  @Mutation(() => RobotsEntity)
  @UseGuards(GqlAuthGuard)
  async updateRobot(
    @Args('', new ValidationPipe()) { id }: BaseIdArgs,
    @Args('', new ValidationPipe()) robot: RobotOptionalArgs,
  ): Promise<RobotsEntity> {
    const oldRobot = await this.robotsService.findOneById(id);
    return this.robotsService.updateOne(oldRobot, {
      ...robot,
      body: JSON.parse(robot.body),
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteRobot(
    @Args('', new ValidationPipe()) { id }: BaseIdArgs,
  ): Promise<true> {
    await this.robotsService.deleteOne(id);
    return true;
  }
}

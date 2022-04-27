import { Query, Resolver } from '@nestjs/graphql';
import { OtherService } from './other.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.auth-guard';

@Resolver()
export class OtherResolver {
  constructor(
    private readonly otherService: OtherService,
  ) {
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  async getRandomMaleName(): Promise<string> {
    return this.otherService.getRandomMaleName();
  }
}

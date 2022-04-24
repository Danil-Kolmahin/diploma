import { Resolver } from '@nestjs/graphql';
import { RobotsService } from './robots.service';

@Resolver()
export class RobotsResolver {
  constructor(
    private readonly robotsService: RobotsService,
  ) {
  }
}

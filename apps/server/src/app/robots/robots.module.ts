import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RobotsEntity, RobotsHistoryEntity } from './robots.entity';
import { RobotsService } from './robots.service';
import { RobotsResolver } from './robots.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RobotsEntity, RobotsHistoryEntity]),
    AuthModule,
    UsersModule,
  ],
  providers: [RobotsService, RobotsResolver],
  exports: [RobotsService],
})
export class RobotsModule {
}

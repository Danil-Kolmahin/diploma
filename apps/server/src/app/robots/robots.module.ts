import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RobotsEntity, RobotsHistoryEntity } from './robots.entity';
import { RobotsService } from './robots.service';
import { RobotsResolver } from './robots.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RobotsEntity, RobotsHistoryEntity]),
    AuthModule,
    FilesModule,
    ProjectsModule,
    UsersModule,
  ],
  providers: [RobotsService, RobotsResolver],
  exports: [RobotsService],
})
export class RobotsModule {
}

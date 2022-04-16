import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ComparisonsEntity } from './comparison.entity';
import { ComparisonService } from './comparison.service';
import { ComparisonResolver } from './comparison.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComparisonsEntity]),
    AuthModule,
    FilesModule,
    ProjectsModule,
    UsersModule,
  ],
  providers: [ComparisonService, ComparisonResolver],
})
export class ComparisonModule {
}

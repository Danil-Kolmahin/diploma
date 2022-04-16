import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProjectsEntity } from './projects.entity';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectsEntity]),
    AuthModule,
  ],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {
}

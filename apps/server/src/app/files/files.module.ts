import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FilesEntity } from './files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilesEntity]), AuthModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {
}

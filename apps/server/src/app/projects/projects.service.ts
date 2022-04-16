import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntity } from '../common/common.entity';
import { ProjectsEntity } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
  ) {
  }

  async createOne(project: Omit<ProjectsEntity, keyof CommonEntity>): Promise<ProjectsEntity> {
    return this.projectsRepository.save(project);
  }
}

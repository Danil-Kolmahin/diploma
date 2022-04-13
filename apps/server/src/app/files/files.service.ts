import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntity } from '../common/common.entity';
import { FilesEntity } from './files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) {
  }

  async findOneById(id: string): Promise<FilesEntity | undefined> {
    return this.filesRepository.findOne({ id });
  }

  async createOne(user: Omit<FilesEntity, keyof CommonEntity>): Promise<FilesEntity> {
    return this.filesRepository.save(user);
  }
}

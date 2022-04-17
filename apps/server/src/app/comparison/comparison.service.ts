import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparisonsEntity } from './comparison.entity';
import { CommonEntity } from '../common/common.entity';
import { UsersEntity } from '../users/users.entity';
import { MAX_32BIT_INT } from '@diploma-v2/common/constants-common';

@Injectable()
export class ComparisonService {
  constructor(
    @InjectRepository(ComparisonsEntity)
    private readonly comparisonsEntity: Repository<ComparisonsEntity>,
  ) {
  }

  async createOne(comparison: Omit<ComparisonsEntity, keyof CommonEntity>): Promise<ComparisonsEntity> {
    return this.comparisonsEntity.save(comparison);
  }

  async findAllByUserPG(user: UsersEntity, {
    skip = 0,
    limit = MAX_32BIT_INT,
  } = {}): Promise<ComparisonsEntity[]> {
    return this.comparisonsEntity.find({
      where: { createdBy: user }, skip, take: limit, relations: ['projects', 'createdBy', 'projects.files'],
    });
  }

  async getCountByUser(user: UsersEntity): Promise<number> {
    return this.comparisonsEntity.count({ createdBy: user });
  }
}

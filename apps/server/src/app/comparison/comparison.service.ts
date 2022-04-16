import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparisonsEntity } from './comparison.entity';
import { CommonEntity } from '../common/common.entity';

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
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparisonsEntity } from './comparison.entity';
import { CommonEntity } from '../common/common.entity';
import { UsersEntity } from '../users/users.entity';
import { ComparisonProjectResult, ComparisonResult, MAX_32BIT_INT } from '@diploma-v2/common/constants-common';
import { Greedy } from 'string-mismatch';
import { FilesEntity } from '../files/files.entity';
import { factorial } from '@diploma-v2/common/utils-common';
import { damerauLevenshtein } from '@diploma-v2/common/source-codes-comparing-methods';
import { calculateProjectsComparingPercent } from '@diploma-v2/common/artificial-intelligence';

@Injectable()
export class ComparisonService {
  constructor(
    @InjectRepository(ComparisonsEntity)
    private readonly comparisonsRepository: Repository<ComparisonsEntity>,
  ) {
  }

  async createOne(comparison: Omit<ComparisonsEntity, keyof CommonEntity>): Promise<ComparisonsEntity> {
    return this.comparisonsRepository.save(comparison);
  }

  async findAllByUserPG(user: UsersEntity, {
    skip = 0,
    limit = MAX_32BIT_INT,
  } = {}): Promise<ComparisonsEntity[]> {
    return this.comparisonsRepository.find({
      where: { createdBy: user },
      skip, take: limit,
      relations: ['projects', 'createdBy', 'projects.files'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCountByUser(user: UsersEntity): Promise<number> {
    return this.comparisonsRepository.count({ createdBy: user });
  }

  async findOneById(id: string): Promise<ComparisonsEntity | null> {
    return this.comparisonsRepository.findOne({
      where: { id }, relations: ['projects', 'createdBy', 'projects.files'],
    });
  }

  async makeComparison(cmp: ComparisonsEntity): Promise<ComparisonsEntity> {
    const results: ComparisonResult = {};

    for (let i = 0; i < cmp.projects.length - 1; i++) {
      const curProject = cmp.projects[i];
      for (let j = i + 1; j < cmp.projects.length; j++) {
        const projectToCompare = cmp.projects[j];
        const curProjectPath = `${curProject.id}|${projectToCompare.id}`;
        results[curProjectPath] = {} as ComparisonProjectResult;
        results[curProjectPath]['FTC'] = 0;  // Full Text Comparison
        results[curProjectPath]['simplePieces'] = [];
        let totalFTCFilesLength = 0;
        results[curProjectPath]['DLD'] = 0;  // Damerau Levenshtein Distance
        let totalDLDFilesLength = 0;

        for (let ci = 0; ci < curProject.files.length; ci++) {
          for (let cj = 0; cj < projectToCompare.files.length; cj++) {
            const [simpleStringsLength, newSimplePieces] = await this.fullTextComparison(
              curProject.files[ci], projectToCompare.files[cj],
            );
            results[curProjectPath]['FTC'] += simpleStringsLength;
            results[curProjectPath]['simplePieces'] = results[curProjectPath]['simplePieces'].concat(newSimplePieces);
            totalFTCFilesLength += Math.min(curProject.files[ci].byteLength, projectToCompare.files[cj].byteLength);

            results[curProjectPath]['DLD'] += damerauLevenshtein(
              curProject.files[ci].data.toString(), projectToCompare.files[cj].data.toString(),
            );
            totalDLDFilesLength += Math.max(curProject.files[ci].byteLength, projectToCompare.files[cj].byteLength);
          }
        }

        results[curProjectPath]['FTC'] /= totalFTCFilesLength;
        results[curProjectPath]['DLD'] /= totalDLDFilesLength;

        results[curProjectPath]['percent'] = calculateProjectsComparingPercent(
          cmp.robot.body, results[curProjectPath],
        );

        cmp.doneOn = 1 / factorial(cmp.projects.length - 1);
        await this.comparisonsRepository.save(cmp);
      }
    }
    cmp.doneAt = new Date();
    cmp.doneOn = 1;
    cmp.results = results;
    return this.comparisonsRepository.save(cmp);
  }

  async fullTextComparison(file1: FilesEntity, file2: FilesEntity): Promise<[number, string[]]> {
    const result = await (new Greedy()).differences(file1.data.toString(), file2.data.toString());
    let simpleStringsLength = 0;
    const simplePieces = [];
    result.forEach(({ type, value }: { type: string, value: string }) => {
      if (type !== 'eql') return;
      if (value.split(/\s/).length < 8) return;
      simplePieces.push(value);
      simpleStringsLength += value.length;
    });
    return [simpleStringsLength, simplePieces];
  }
}

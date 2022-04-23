import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparisonsEntity } from './comparison.entity';
import { CommonEntity } from '../common/common.entity';
import { UsersEntity } from '../users/users.entity';
import { MAX_32BIT_INT } from '@diploma-v2/common/constants-common';
import { Greedy } from 'string-mismatch';
import { FilesEntity } from '../files/files.entity';
import { factorial } from '@diploma-v2/common/utils-common';
import { damerauLevenshtein } from '@diploma-v2/common/source-codes-comparing-methods';

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
      where: { createdBy: user },
      skip, take: limit,
      relations: ['projects', 'createdBy', 'projects.files'],
      order: { createdAt: 'DESC' }
    });
  }

  async getCountByUser(user: UsersEntity): Promise<number> {
    return this.comparisonsEntity.count({ createdBy: user });
  }

  async findOneById(id: string): Promise<ComparisonsEntity | null> {
    return this.comparisonsEntity.findOne({
      where: { id }, relations: ['projects', 'createdBy', 'projects.files'],
    });
  }

  async makeComparison(cmp: ComparisonsEntity): Promise<ComparisonsEntity> {
    const results = {};
    for (let i = 0; i < cmp.projects.length - 1; i++) {
      const curProject = cmp.projects[i];
      for (let j = i + 1; j < cmp.projects.length; j++) {
        const projectToCompare = cmp.projects[j];

        let projectsFullTextComparison = 0;
        let simplePieces = [];
        const distances = {};
        for (let ci = 0; ci < curProject.files.length; ci++) {
          for (let cj = 0; cj < projectToCompare.files.length; cj++) {
            const [simpleStringsLength, newSimplePieces] = await this.fullTextComparison(
              curProject.files[ci], projectToCompare.files[cj],
            );
            projectsFullTextComparison += simpleStringsLength;
            simplePieces = simplePieces.concat(newSimplePieces);
            distances[`${ci}|${cj}`] = damerauLevenshtein(
              curProject.files[ci].data.toString(), projectToCompare.files[cj].data.toString()
            );
          }
        }
        const curProjectFilesLength = curProject.files.reduce(
          (acc, file) => acc + file.byteLength, 0,
        );
        const projectToCompareFilesLength = projectToCompare.files.reduce(
          (acc, file) => acc + file.byteLength, 0,
        );
        results[`projectsFullTextComparison:${curProject.name}-${projectToCompare.name}`] =
          projectsFullTextComparison / (curProjectFilesLength + projectToCompareFilesLength + 1) / 2;
        results[`projectsFullTextComparisonSimplePieces:${curProject.name}-${projectToCompare.name}`] =
          simplePieces;

        results[`projectsDamerauLevenshteinDistance:${curProject.name}-${projectToCompare.name}`] =
          distances;

        cmp.doneOn = 1 / factorial(cmp.projects.length - 1);
        await this.comparisonsEntity.save(cmp);
      }
    }
    cmp.doneAt = new Date();
    cmp.doneOn = 1;
    cmp.results = results;
    return this.comparisonsEntity.save(cmp);
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

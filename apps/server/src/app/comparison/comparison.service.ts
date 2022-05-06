import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparisonsEntity } from './comparison.entity';
import { CommonEntity } from '../common/common.entity';
import { UsersEntity } from '../users/users.entity';
import {
  ComparisonProjectResult,
  ComparisonResult,
  MAX_32BIT_INT,
  RESERVED_KEYWORDS,
} from '@diploma-v2/common/constants-common';
import { Greedy } from 'string-mismatch';
import { FilesEntity } from '../files/files.entity';
import { factorial, isReservedKeywords } from '@diploma-v2/common/utils-common';
import { damerauLevenshtein } from '@diploma-v2/common/source-codes-comparing-methods';
import { calculateProjectsComparingPercent } from '@diploma-v2/common/artificial-intelligence';
import * as Jaccard from 'jaccard-index';

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
      where: { id }, relations: ['projects', 'createdBy', 'projects.files', 'robot'],
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
        results[curProjectPath]['AST_FTC'] = 0;
        let totalASTFTCFilesLength = 0;
        const totalRKCCurProject = Object.keys(RESERVED_KEYWORDS).reduce((acc, cur) => ({
          ...acc, [cur]: 0,
        }), {});
        const totalRKCProjectToCompare = Object.keys(RESERVED_KEYWORDS).reduce((acc, cur) => ({
          ...acc, [cur]: 0,
        }), {});

        let curProjectFilesForJaccard = [];
        let projectToCompareFilesForJaccard = [];

        for (let ci = 0; ci < curProject.files.length; ci++) {
          for (let cj = 0; cj < projectToCompare.files.length; cj++) {
            if (curProject.files[ci].minifiedData)
              curProjectFilesForJaccard = curProjectFilesForJaccard
                .concat(curProject.files[ci].minifiedData.split(','));
            if (projectToCompare.files[cj].minifiedData)
              projectToCompareFilesForJaccard = projectToCompareFilesForJaccard
                .concat(projectToCompare.files[cj].minifiedData.split(','));

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

            const curProjectDataAST = JSON.stringify(curProject.files[ci].dataAST);
            const projectToCompareDataAST = JSON.stringify(projectToCompare.files[ci].dataAST);
            results[curProjectPath]['AST_FTC'] += await this.fullTextComparisonString(
              curProjectDataAST, projectToCompareDataAST,
            );
            totalASTFTCFilesLength += Math.min(curProjectDataAST.length, projectToCompareDataAST.length);

            Object.entries(await this.countReservedKeywords(
              curProject.files[ci].data,
            )).forEach(([key, value]) =>
              totalRKCCurProject[key] += value);
            Object.entries(await this.countReservedKeywords(
              projectToCompare.files[cj].data,
            )).forEach(([key, value]) =>
              totalRKCProjectToCompare[key] += value);
          }
        }

        results[curProjectPath]['FTC'] /= totalFTCFilesLength;
        results[curProjectPath]['DLD'] /= totalDLDFilesLength;
        const JIndex = await this.jaccardIndexComparison({
          [curProject.id]: curProjectFilesForJaccard,
          [projectToCompare.id]: projectToCompareFilesForJaccard,
        });
        results[curProjectPath]['JIndex'] = JIndex && JIndex[0] && JIndex[0].value;
        results[curProjectPath]['AST_FTC'] /= totalASTFTCFilesLength;
        let RKCReservedKeywordsLength = Object.keys(RESERVED_KEYWORDS).length;
        results[curProjectPath]['RKC'] = Object.keys(RESERVED_KEYWORDS) // Reserved Keywords Comparison
          .reduce((acc, key) => {
            const max = Math.max(totalRKCCurProject[key], totalRKCProjectToCompare[key]);
            if (max === 0) {
              RKCReservedKeywordsLength--;
              return acc;
            }
            const min = Math.min(totalRKCCurProject[key], totalRKCProjectToCompare[key]);
            return acc + min / max;
          }, 0) / RKCReservedKeywordsLength;

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

  async jaccardIndexComparison(projects: {
    [key: string]: string[]
  }): Promise<{ source: string, target: string, value: number }[]> {
    const items = Object.keys(projects);
    return new Promise((resolve, reject) => {
      Jaccard({
        getLog: (item) => Promise.resolve(projects[item]),
      }).getLinks(items).then(resolve).catch(reject);
    });
  }

  async fullTextComparisonString(str1: string, str2: string): Promise<number> {
    const result = await (new Greedy()).differences(str1, str2);
    let simpleStringsLength = 0;
    result.forEach(({ type, value }: { type: string, value: string }) => {
      if (type !== 'eql') return;
      simpleStringsLength += value.length;
    });
    return simpleStringsLength;
  }

  async countReservedKeywords(file: string): Promise<{
    [key in RESERVED_KEYWORDS]: number
  }> {
    const preparedFile = file.replace(/[{}!();]/g, '');
    const result = Object.keys(RESERVED_KEYWORDS).reduce((acc, cur) => ({
      ...acc, [cur]: 0,
    }), {}) as { [key in RESERVED_KEYWORDS]: number };
    for (const pretender of preparedFile.split(/(\s|\r\n|\r|\n)/)) {
      if (isReservedKeywords(pretender)) {
        if (!result[pretender]) result[pretender] = 0;
        result[pretender]++;
      }
    }
    return result;
  }
}

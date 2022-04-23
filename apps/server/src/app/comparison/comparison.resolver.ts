import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ComparisonService } from './comparison.service';
import { UseGuards, BadRequestException, ValidationPipe } from '@nestjs/common';
import { Auth, GqlAuthGuard } from '../auth/gql.auth-guard';
import { streamToBuffer } from '@diploma-v2/backend/utils-backend';
import { ComparisonsEntity } from './comparison.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FilesService } from '../files/files.service';
import { ProjectsService } from '../projects/projects.service';
import { checkFileType } from '@diploma-v2/common/utils-common';
import { CookieTokenDataI } from '@diploma-v2/common/constants-common';
import { UsersService } from '../users/users.service';
import { BasePaginationArgs } from '../common/common.resolver';
import * as prettier from 'prettier';

@Resolver('comparison')
export class ComparisonResolver {
  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly projectsService: ProjectsService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {
  }

  @Mutation(() => ComparisonsEntity)
  @UseGuards(GqlAuthGuard)
  async makeComparison(
    @Args('projects', { type: () => [[GraphQLUpload]] }) projects: FileUpload[][],
    @Args('projectNames', { type: () => [String] }) projectNames: string[],
    @Args('projectCreatorNames', { type: () => [String] }) projectCreatorNames: string[],
    @Args('fileTypes', { type: () => [String] }) fileTypes: string[],
    @Auth() auth: CookieTokenDataI,
  ): Promise<ComparisonsEntity> {
    if (!fileTypes.length) throw new BadRequestException();
    const user = await this.usersService.findOneById(auth.id);
    const projectsToSave = [];
    for (let i = 0; i < projects.length; i++) {
      const files = projects[i];
      const projectFiles = [];
      for await (const file of files) {
        if (!checkFileType(file.filename, fileTypes)) continue;
        let data = (await streamToBuffer(file.createReadStream())).toString();
        try {
          data = prettier.format(data, { parser: 'babel-ts' });
        } catch (error) {
          console.log({ error, date: new Date() });
        }
        const savedFile = await this.filesService.createOne({
          ...file, data, byteLength: Buffer.byteLength(data), createdBy: user,
        });
        if (savedFile && savedFile.data) savedFile.data = savedFile.data.toString();
        projectFiles.push(savedFile);
      }
      if (!projectFiles.length) continue;
      const savedProject = await this.projectsService.createOne({
        name: projectNames[i] || `Project #${i}`,
        creatorName: projectCreatorNames[i] || `unknown`,
        files: projectFiles,
        createdBy: user,
      });
      projectsToSave.push(savedProject);
    }
    if (projectsToSave.length < 2) throw new BadRequestException();
    const createdComparison = await this.comparisonService.createOne({
      fileTypes,
      projects: projectsToSave,
      createdBy: user,
    });
    this.comparisonService.makeComparison(createdComparison).then();
    return createdComparison;
  }

  @Query(() => [ComparisonsEntity])
  async findAllComparisons(
    @Args('', new ValidationPipe()) basePG: BasePaginationArgs,
    @Auth() auth: CookieTokenDataI,
  ): Promise<ComparisonsEntity[]> {
    const user = await this.usersService.findOneById(auth.id);
    return this.comparisonService.findAllByUserPG(user, basePG);
  }

  @Query(() => Int)
  async getComparisonsCount(
    @Auth() auth: CookieTokenDataI,
  ): Promise<number> {
    const user = await this.usersService.findOneById(auth.id);
    return this.comparisonService.getCountByUser(user);
  }

  @Query(() => ComparisonsEntity, { nullable: true })
  async findComparisonById(
    @Args('id') id: string,
  ): Promise<ComparisonsEntity | null> {
    return this.comparisonService.findOneById(id);
  }
}

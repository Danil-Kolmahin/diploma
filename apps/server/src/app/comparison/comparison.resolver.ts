import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ComparisonService } from './comparison.service';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.auth-guard';
import { streamToBuffer } from '@diploma-v2/backend/utils-backend';
import { ComparisonsEntity } from './comparison.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FilesService } from '../files/files.service';
import { ProjectsService } from '../projects/projects.service';
import { checkFileType } from '@diploma-v2/common/utils-common';

@Resolver('comparison')
export class ComparisonResolver {
  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly projectsService: ProjectsService,
    private readonly filesService: FilesService,
  ) {
  }

  @Mutation(() => ComparisonsEntity)
  @UseGuards(GqlAuthGuard)
  async makeComparison(
    @Args('projects', { type: () => [[GraphQLUpload]] }) projects: FileUpload[][],
    @Args('projectNames', { type: () => [String] }) projectNames: string[],
    @Args('projectCreatorNames', { type: () => [String] }) projectCreatorNames: string[],
    @Args('fileTypes', { type: () => [String] }) fileTypes: string[],
  ): Promise<ComparisonsEntity> {
    if (!fileTypes.length) throw new BadRequestException();
    const projectsToSave = [];
    for (let i = 0; i < projects.length; i++) {
      const files = projects[i];
      const projectFiles = [];
      for await (const file of files) {
        if (!checkFileType(file.filename, fileTypes)) continue;
        const data = await streamToBuffer(file.createReadStream());
        const savedFile = await this.filesService.createOne({
          ...file, data, byteLength: Buffer.byteLength(data),
        });
        if (savedFile && savedFile.data) savedFile.data = savedFile.data.toString();
        projectFiles.push(savedFile);
      }
      if (!projectFiles.length) continue;
      const savedProject = await this.projectsService.createOne({
        name: projectNames[i] || `Project #${i}`,
        creatorName: projectCreatorNames[i] || `unknown`,
        files: projectFiles,
      });
      projectsToSave.push(savedProject);
    }
    if (projectsToSave.length < 2) throw new BadRequestException();
    return this.comparisonService.createOne({
      fileTypes,
      projects: projectsToSave,
    });
  }
}

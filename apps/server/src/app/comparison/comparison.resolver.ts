import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ComparisonService } from './comparison.service';
import { BadRequestException, UseGuards, ValidationPipe } from '@nestjs/common';
import { Auth, GqlAuthGuard } from '../auth/gql.auth-guard';
import { streamToBuffer } from '@diploma-v2/backend/utils-backend';
import { ComparisonsEntity } from './comparison.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from '../files/files.service';
import { ProjectsService } from '../projects/projects.service';
import { checkFileType, getCircularReplacer } from '@diploma-v2/common/utils-common';
import { CookieTokenDataI } from '@diploma-v2/common/constants-common';
import { UsersService } from '../users/users.service';
import { BaseIdArgs, BasePaginationArgs } from '../common/common.resolver';
import * as prettier from 'prettier';
import * as strip from 'strip-comments';
import { RobotsService } from '../robots/robots.service';
import { RobotsEntity } from '../robots/robots.entity';
import * as UglifyJS from 'uglify-js';

@Resolver()
export class ComparisonResolver {
  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly projectsService: ProjectsService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly robotsService: RobotsService,
  ) {
  }

  @Mutation(() => ComparisonsEntity)
  @UseGuards(GqlAuthGuard)
  async makeComparison(
    @Args('projects', { type: () => [[GraphQLUpload]] }) projects: FileUpload[][],
    @Args('projectNames', { type: () => [String] }) projectNames: string[],
    @Args('projectCreatorNames', { type: () => [String] }) projectCreatorNames: string[],
    @Args('fileTypes', { type: () => [String] }) fileTypes: string[],
    @Args('robotId') robotId: string,
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
        let minifiedData;
        let dataAST;
        try {
          data = prettier.format(data, { parser: 'babel-ts' });
          data = strip(data);
          const uglified = UglifyJS.minify(data, {
            toplevel: true,
            output: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ast: true,
            },
          });
          if (!uglified.error) minifiedData = uglified.code;
          if (!uglified.error) dataAST = JSON.parse(JSON.stringify(
            (uglified as any).ast, getCircularReplacer(),
          ));
        } catch (error) {
          console.log({ error, date: new Date() });
        }
        const savedFile = await this.filesService.createOne({
          ...file, data: Buffer.from(data),
          byteLength: Buffer.byteLength(data), createdBy: user,
          minifiedData: Buffer.from(minifiedData),
          dataAST,
        });
        projectFiles.push(savedFile);
      }
      if (!projectFiles.length) continue;
      const savedProject = await this.projectsService.createOne({
        name: projectNames[i] || `Project #${i}`,
        creatorName: projectCreatorNames[i] || `unknown`,
        files: projectFiles,
        createdBy: user,
        filesNum: files.length,
      });
      projectsToSave.push(savedProject);
    }
    if (projectsToSave.length < 2) throw new BadRequestException();
    const createdComparison = await this.comparisonService.createOne({
      fileTypes,
      projects: projectsToSave,
      createdBy: user,
      robot: await this.robotsService.findOneById(robotId) || this.robotsService.DEFAULT_ROBOT,
    });
    this.comparisonService.makeComparison(createdComparison).then();
    return createdComparison;
  }

  @Query(() => [ComparisonsEntity], { nullable: 'items' })
  @UseGuards(GqlAuthGuard)
  async findAllComparisons(
    @Args('', new ValidationPipe()) basePG: BasePaginationArgs,
    @Auth() auth: CookieTokenDataI,
  ): Promise<ComparisonsEntity[]> {
    const user = await this.usersService.findOneById(auth.id);
    return this.comparisonService.findAllByUserPG(user, basePG);
  }

  @Query(() => Int)
  @UseGuards(GqlAuthGuard)
  async getComparisonsCount(
    @Auth() auth: CookieTokenDataI,
  ): Promise<number> {
    const user = await this.usersService.findOneById(auth.id);
    return this.comparisonService.getCountByUser(user);
  }

  @Query(() => ComparisonsEntity, { nullable: true })
  async findComparisonById(
    @Args('', new ValidationPipe()) { id }: BaseIdArgs,
  ): Promise<ComparisonsEntity | null> {
    return this.comparisonService.findOneById(id);
  }

  @Mutation(() => RobotsEntity)
  @UseGuards(GqlAuthGuard)
  async growRobot(
    @Args('comparisonId') comparisonId: string,
    @Args('firstProjectId') firstProjectId: string,
    @Args('secondProjectId') secondProjectId: string,
    @Args('rightPercent') rightPercent: number,
  ): Promise<RobotsEntity> {
    const comparison = await this.comparisonService.findOneById(comparisonId);
    return this.robotsService.growOneById(
      comparison,
      firstProjectId,
      secondProjectId,
      rightPercent,
    );
  }
}

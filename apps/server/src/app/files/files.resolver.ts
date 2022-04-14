import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.auth-guard';
import { FilesService } from './files.service';
import { FilesEntity } from './files.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { streamToBuffer } from '@diploma-v2/backend/utils-backend';

@Resolver('files')
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService,
  ) {
  }

  @Query(() => FilesEntity, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async findFileById(@Args('id') id: string): Promise<FilesEntity | undefined> {
    const file = await this.filesService.findOneById(id);
    if (file && file.data) file.data = file.data.toString();
    return file;
  }

  @Mutation(() => FilesEntity)
  @UseGuards(GqlAuthGuard)
  async saveFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<FilesEntity> {
    const data = await streamToBuffer(file.createReadStream());
    const savedFile = await this.filesService.createOne({ ...file, data });
    if (savedFile && savedFile.data) savedFile.data = savedFile.data.toString();
    return savedFile;
  }
}

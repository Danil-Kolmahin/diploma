import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.auth-guard';
import { FilesService } from './files.service';
import { FilesEntity } from './files.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Stream } from 'stream';

const streamToBuffer = async (stream: Stream): Promise<Buffer> => new Promise<Buffer>(
  (resolve, reject) => {
    const _buf = Array<any>();
    stream.on('data', chunk => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', err => reject(`error converting stream - ${err}`));
  },
);

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
    if (file.data) file.data = file.data.toString();
    return file;
  }

  // @Mutation(() => FilesEntity)
  // @UseGuards(GqlAuthGuard)
  // async saveFile(
  //   @Args('', new ValidationPipe()) file: BaseFileArgs,
  // ): Promise<FilesEntity> {
  //   return this.filesService.createOne(file);
  // }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async saveFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    const data = await streamToBuffer(file.createReadStream());
    await this.filesService.createOne({ ...file, data });
    return true;
  }
}

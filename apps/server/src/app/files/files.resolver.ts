import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonEntity } from '../common/common.entity';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql.auth-guard';
import { FilesService } from './files.service';
import { FilesEntity } from './files.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
class BaseFileArgs implements Omit<FilesEntity, keyof CommonEntity> {
  @Field()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  data: string;
}

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

  @Mutation(() => FilesEntity)
  @UseGuards(GqlAuthGuard)
  async saveFile(
    @Args('', new ValidationPipe()) file: BaseFileArgs,
  ): Promise<FilesEntity> {
    return this.filesService.createOne(file);
  }
}

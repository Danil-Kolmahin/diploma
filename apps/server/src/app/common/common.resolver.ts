import { ArgsType, Field, Int } from '@nestjs/graphql';
import { MAX_32BIT_INT } from '@diploma-v2/common/constants-common';
import { Min, Max, IsUUID } from 'class-validator';

@ArgsType()
export class BasePaginationArgs {
  @Field(() => Int)
  @Min(0)
  @Max(MAX_32BIT_INT)
  skip = 0;

  @Field(() => Int)
  @Min(0)
  @Max(MAX_32BIT_INT)
  limit = MAX_32BIT_INT;
}

@ArgsType()
export class BaseIdArgs {
  @Field()
  @IsUUID()
  id: string;
}

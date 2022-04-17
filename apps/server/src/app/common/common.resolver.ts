import { ArgsType, Field, Int } from '@nestjs/graphql';
import { MAX_32BIT_INT } from '@diploma-v2/common/constants-common';

@ArgsType()
export class BasePaginationArgs {
  @Field(() => Int)
  skip = 0;

  @Field(() => Int)
  limit = MAX_32BIT_INT;
}

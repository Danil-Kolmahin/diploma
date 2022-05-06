import { RESERVED_KEYWORDS } from '@diploma-v2/common/constants-common';

export const isReservedKeywords = (pretender: string): boolean =>
  !!((RESERVED_KEYWORDS as any)[pretender]);

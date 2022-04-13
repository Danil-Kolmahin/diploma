import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from '../common/common.entity';

@ObjectType()
@Entity('files')
export class FilesEntity extends CommonEntity {
  @Field()
  @Column({ type: 'varchar' })
  filename: string;

  @Field()
  @Column({ type: 'bytea' })
  data: string;
}

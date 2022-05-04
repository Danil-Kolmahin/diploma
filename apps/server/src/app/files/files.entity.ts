import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonCreatedEntity } from '../common/common.entity';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Entity('files')
export class FilesEntity extends CommonCreatedEntity {
  @Field()
  @Column({ type: 'varchar' })
  filename: string;

  @Field()
  @Column({ type: 'varchar' })
  mimetype: string;

  @Field()
  @Column({ type: 'varchar' })
  encoding: string;

  @Field()
  @Column({ type: 'bytea' })
  data: string;

  @Field({ nullable: true })
  @Column({ type: 'bytea', nullable: true })
  minifiedData?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'json', nullable: true })
  dataAST?: string;

  @Field()
  @Column({ type: 'integer' })
  byteLength: number;
}

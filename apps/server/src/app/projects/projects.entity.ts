import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CommonCreatedEntity } from '../common/common.entity';
import { FilesEntity } from '../files/files.entity';

@ObjectType()
@Entity('projects')
export class ProjectsEntity extends CommonCreatedEntity {
  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'varchar' })
  creatorName: string;

  @Field(() => [FilesEntity])
  @ManyToMany(() => FilesEntity)
  @JoinTable()
  files: FilesEntity[];

  @Field()
  @Column({ type: 'int' })
  filesNum: number;
}

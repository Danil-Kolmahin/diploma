import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonCreatedEntity } from '../common/common.entity';
import { ComparisonResult } from '@diploma-v2/common/constants-common';
import { ProjectsEntity } from '../projects/projects.entity';

@ObjectType()
@Entity('comparisons')
export class ComparisonsEntity extends CommonCreatedEntity {
  @Field(() => [String])
  @Column({ type: 'varchar', array: true })
  fileTypes: string[];

  @Field(() => [ProjectsEntity])
  @ManyToMany(() => ProjectsEntity)
  @JoinTable()
  projects: ProjectsEntity[];

  @Field()
  @Column({ type: 'smallint', default: 0 })
  doneOn?: number;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  doneAt?: Date;

  // @Field()
  @Column({ type: 'json', nullable: true })
  results?: ComparisonResult;
}

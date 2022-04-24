import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CommonCreatedEntity } from '../common/common.entity';
import { ComparisonResult } from '@diploma-v2/common/constants-common';
import { ProjectsEntity } from '../projects/projects.entity';
import { GraphQLJSON } from 'graphql-type-json';
import { RobotsEntity } from '../robots/robots.entity';

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

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  doneOn?: number;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  doneAt?: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'json', nullable: true })
  results?: ComparisonResult;

  @Field(() => RobotsEntity)
  @ManyToOne(() => RobotsEntity)
  robot: RobotsEntity;
}

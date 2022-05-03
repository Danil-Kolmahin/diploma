import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonCreatedEntity } from '../common/common.entity';
import { GraphQLJSON } from 'graphql-type-json';
import { RobotsChromosome } from '@diploma-v2/common/constants-common';

@ObjectType()
@Entity('robots')
export class RobotsEntity extends CommonCreatedEntity {
  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => GraphQLJSON)
  @Column({ type: 'json' })
  body: RobotsChromosome;

  @Field()
  @Column({ type: 'boolean' })
  growable: boolean;
}

@ObjectType()
@Entity('robots-history')
export class RobotsHistoryEntity extends RobotsEntity {
  @Field(() => RobotsEntity)
  @ManyToOne(() => RobotsEntity)
  currentVersion: RobotsEntity;
}

import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonCreatedEntity } from '../common/common.entity';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Entity('robots')
export class RobotsEntity extends CommonCreatedEntity {
  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => GraphQLJSON)
  @Column({ type: 'json' })
  body: any;

  @Field()
  @Column({ type: 'boolean' })
  growable: boolean;
}

@ObjectType()
@Entity('robots-history')
export class RobotsHistoryEntity extends RobotsEntity {
  @Field(() => RobotsEntity)
  @OneToOne(() => RobotsEntity)
  @JoinColumn()
  currentVersion: RobotsEntity;
}

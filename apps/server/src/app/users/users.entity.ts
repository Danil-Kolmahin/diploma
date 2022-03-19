import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from '../common/common.entity';

@ObjectType()
@Entity('users')
export class UsersEntity extends CommonEntity {
  @Field()
  @Column({
    type: 'varchar',
    length: 254,
    unique: true,
  })
  email: string;

  @Field()
  @Column({ type: 'varchar' })
  password: string;
}

import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '../users/users.entity';

@ObjectType()
@Entity()
export class CommonEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

@ObjectType()
@Entity()
export class CommonCreatedEntity extends CommonEntity {
  @Field(() => UsersEntity)
  @ManyToOne(() => UsersEntity)
  createdBy: UsersEntity;
}

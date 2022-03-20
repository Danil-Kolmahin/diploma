import { Module } from '@nestjs/common';

import { environment } from '../environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...environment.connection,
      // entities: [UserEntity],
    }),
    GraphQLModule.forRoot({
      // typePaths: ['./**/*.graphql'],
      // context: ({ res }) => ({ res }),
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    }),
    UsersModule,
  ],
  providers: [],
})
export class AppModule {
}

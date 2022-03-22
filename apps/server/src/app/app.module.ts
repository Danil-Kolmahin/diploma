import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'aurora-data-api',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
      database: process.env.DB_NAME,
      // dropSchema: false,
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
      entities: [ __dirname + 'dist/**/*.entity{.ts,.js}' ],
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
    AuthModule,
  ],
  providers: [],
})
export class AppModule {
}

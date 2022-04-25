import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ComparisonModule } from './comparison/comparison.module';
import { ProjectsModule } from './projects/projects.module';
import { RobotsModule } from './robots/robots.module';
import { HighLevelAuthModule } from './highLevelAuth/highLevelAuth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'aurora-data-api',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
      entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot({
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      cors: {
        credentials: true,
        origin: `${process.env.NX_API_PROTOCOL}://${process.env.NX_API_HOST}`,
      },
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    ProjectsModule,
    ComparisonModule,
    RobotsModule,
    HighLevelAuthModule,
  ],
  providers: [],
})
export class AppModule {
}

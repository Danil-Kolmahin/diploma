import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  process.env.TZ = 'UTC';

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 100 }));
  const port = process.env.NX_API_PORT || 3333;
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}
     Graphql: http://localhost:${port}/graphql`,
  );
}

bootstrap().then();

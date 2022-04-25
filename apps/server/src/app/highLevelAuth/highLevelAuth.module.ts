import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { HighLevelAuthResolver } from './highLevelAuth.resolver';
import { RobotsModule } from '../robots/robots.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RobotsModule,
  ],
  providers: [HighLevelAuthResolver],
})
export class HighLevelAuthModule {
}

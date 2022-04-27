import { Module } from '@nestjs/common';
import { OtherService } from './other.service';
import { OtherResolver } from './other.resolver';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule,],
  providers: [OtherResolver, OtherService],
})
export class OtherModule {
}

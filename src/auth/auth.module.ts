import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientModule } from 'src/client/client.module';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UsersModule, ClientModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}

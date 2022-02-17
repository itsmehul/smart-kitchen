import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientResolver } from './client.resolver';
import { ClientService } from './client.service';
import { Client } from './entities/Client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientResolver, ClientService],
  exports: [ClientService],
})
export class ClientModule {}

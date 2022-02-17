import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientInput } from './dtos/client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly client: Repository<Client>,
  ) {}

  createClient(input: CreateClientInput): Promise<Client> {
    const client = this.client.create(input);

    return this.client.save(client);
  }

  getClientFromKey(key: string): Promise<Client> {
    return this.client.findOne({ apiKey: key });
  }
}

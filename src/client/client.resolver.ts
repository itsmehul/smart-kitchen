import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { ClientOutput, CreateClientInput } from './dtos/client.dto';

@Resolver()
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => ClientOutput)
  async createClient(
    @Args('input') input: CreateClientInput,
  ): Promise<ClientOutput> {
    const client = await this.clientService.createClient(input);
    return { ok: true, client };
  }
}

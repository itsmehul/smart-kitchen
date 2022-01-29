import { Resolver } from '@nestjs/graphql';
import { TiramizooService } from './tiramizoo.service';

@Resolver()
export class TiramizooResolver {
  constructor(private readonly tiramizooService: TiramizooService) {}
}

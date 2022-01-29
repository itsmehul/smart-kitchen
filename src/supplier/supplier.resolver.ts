import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SupplierService } from './supplier.service';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';

@Resolver(() => Supplier)
export class SupplierResolver {
  constructor(private readonly supplierService: SupplierService) {}

  @Mutation(() => Supplier)
  createSupplier(
    @Args('createSupplierInput') createSupplierInput: CreateSupplierInput,
  ) {
    return this.supplierService.create(createSupplierInput);
  }

  @Query(() => [Supplier], { name: 'supplier' })
  findAll() {
    return this.supplierService.findAll();
  }

  @Query(() => Supplier, { name: 'supplier' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.supplierService.findOne(id);
  }

  @Mutation(() => Supplier)
  updateSupplier(
    @Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput,
  ) {
    return this.supplierService.update(
      updateSupplierInput.id,
      updateSupplierInput,
    );
  }

  @Mutation(() => Supplier)
  removeSupplier(@Args('id', { type: () => Int }) id: number) {
    return this.supplierService.remove(id);
  }
}

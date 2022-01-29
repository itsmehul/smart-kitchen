import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput extends OmitType(Category, ['recipes']) {}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {
  @Field(() => Category, { nullable: true })
  Category?: Category;
}

@ObjectType()
export class BulkCreateCategoryOutput extends CoreOutput {
  @Field(() => Category, { nullable: true })
  categories?: Category[];
}

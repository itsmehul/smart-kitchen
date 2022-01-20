import { Field, InputType } from '@nestjs/graphql';
import { CartItem, WishlistItem } from '../entities/user.entity';

@InputType()
export class CartInputType {
  @Field(() => [CartItem], { nullable: true })
  cart: CartItem[];
}

@InputType()
export class WishlistInputType {
  @Field(() => [WishlistItem], { nullable: true })
  wishlist: WishlistItem[];
}

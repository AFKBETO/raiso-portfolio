import type { CartInfoInt, CartItemDetailsInt } from '~/database/BuyerModel';

export default function parseTitle(product: CartInfoInt | CartItemDetailsInt): string {
  if (!product.productTitle) {
    return product.title;
  }
  return `${product.title} | ${product.productTitle}`;
}

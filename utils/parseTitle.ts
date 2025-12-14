import type { CartInfoInt } from '~/database/BuyerModel';

export default function parseTitle(product: CartInfoInt): string {
  if (!product.productTitle) {
    return product.title;
  }
  return `${product.title} | ${product.productTitle}`;
}

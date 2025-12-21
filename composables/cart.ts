import type { CartInfoInt, ClientOrderInt } from '~/database/BuyerModel';
import type { PieceLocaleInt } from '~/database/WorkModel';

export const useCart = () => {
  const cart = useCookie('cart', {
    default: () => ({
    } as ClientOrderInt),
    sameSite: true,
  });
  return cart;
};

export const useCartInfo = () => {
  const cartCookie = useCart();
  return useLazyAsyncData<CartInfoInt[][]>('cart-items', async () => {
    const purgeItems: string[] = [];
    const itemsInCart: CartInfoInt[] = [];
    const unavailableItems: CartInfoInt[] = [];
    for (const key in cartCookie.value) {
      const cartItem = cartCookie.value[key];
      if (!cartItem || cartItem.quantity === 0) {
        purgeItems.push(key);
        continue;
      }
      const product = await $fetch<PieceLocaleInt>(`/api/works/${cartItem.workId}/pieces/${cartItem.pieceId}`);
      if (!!product && !!product.productInfo) {
        const item = {
          _id: product._id,
          workId: product.workId,
          title: product.title,
          productTitle: product.productInfo.productTitle,
          sellPrice: product.productInfo.price,
          imageUrl: product.imageUrls[product.primaryImageIndex] || '',
          minQuantity: product.productInfo.minQuantity,
          maxQuantity: product.productInfo.maxQuantity,
          quantity: cartItem.quantity,
          amount: cartItem.quantity * product.productInfo.price,
          isSoldout: product.productInfo.isSoldout,
        };
        if (item.isSoldout) {
          unavailableItems.push(item);
        }
        else {
          itemsInCart.push(item);
        }
      }
      else {
        purgeItems.push(key);
      }
    }
    for (const item of purgeItems) {
      cartCookie.value[item] = undefined;
    }
    return [itemsInCart, unavailableItems];
  }, { server: false, watch: [cartCookie], default: () => [[], []] as CartInfoInt[][] });
};

import type { ClientOrderInt } from '~/database/BuyerModel';

export const useCart = () => {
  const cart = useCookie('cart', {
    default: () => ({
    } as ClientOrderInt),
  });
  return cart;
};

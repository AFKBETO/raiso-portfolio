import { getAllOrders } from '~/database/buyerData';
import type { OrderDetailsInt } from '~/database/BuyerModel';

export default defineEventHandler(async (event): Promise<OrderDetailsInt[]> => {
  const { email } = event.context ?? '';

  if (!email) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The user is not logged in',
    });
  }

  const orders = await getAllOrders(email);
  return orders;
});

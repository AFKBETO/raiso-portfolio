import { createCartForUser } from '~/database/buyerData';
import type { CartIdInt, CartInt } from '~/database/BuyerModel';

export default defineEventHandler(async (event): Promise<CartIdInt> => {
  const { email } = event.context ?? '';

  if (!email) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The user is not logged in',
    });
  }

  try {
    const cartInfo = await readBody<CartInt>(event);

    const result = await createCartForUser(email, cartInfo);

    return result;
  }
  catch (error) {
    console.error('Error creating cart:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      stack: (error as Error).stack,
    });
  }
});

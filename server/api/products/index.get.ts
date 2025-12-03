import { fetchProductCardsByName } from '~/database/workData';
import type { ProductCardInt } from '~/database/WorkModel';

export default defineEventHandler(async (event): Promise<ProductCardInt[]> => {
  try {
    const query = getQuery(event);

    const productName = String(query.name ?? '');
    const pageSize = Number(query.pageSize) || 10;
    const pageNumber = Number(query.pageNumber) || 1;
    const category = String(query.category ?? '');

    const products = await fetchProductCardsByName({
      pageSize,
      pageNumber,
      searchTerm: productName,
      category,
    });
    return products;
  }
  catch (error) {
    console.error('Error fetching products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      stack: (error as Error).stack,
    });
  }
});

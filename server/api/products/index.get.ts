import { fetchProductCards } from '~/database/workData';
import type { ProductCardInt } from '~/database/WorkModel';
import type { Page } from '~/types/page';

export default defineEventHandler(async (event): Promise<Page<ProductCardInt>> => {
  try {
    const query = getQuery(event);
    console.log(query);
    const productName = String(query.name || ''),
      pageSize = Number(query.pageSize || 10),
      pageNumber = Number(query.pageNumber || 1),
      category = String(query.category || '');

    const products = await fetchProductCards({
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

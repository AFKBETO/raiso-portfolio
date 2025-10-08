import { fetchAllPieces } from '~/database/workData';
import type { PieceWithWorkIdInt } from '~/database/WorkModel';

export default defineEventHandler(async (event): Promise<PieceWithWorkIdInt[]> => {
  const query = getQuery(event);

  const isShow = query.isShow === 'true';

  const pieces = await fetchAllPieces(isShow);

  return pieces;
});

import { fetchAllPieces } from '~/database/workData';
import type { PieceWithWorkIdInt } from '~/database/WorkModel';

export default defineEventHandler(async (event): Promise<PieceWithWorkIdInt[]> => {
  const query = getQuery(event);

  const pieces = await fetchAllPieces(query.isShow === 'true');

  return pieces;
});

import { fetchAllPieces } from '~/database/workData';
import type { PieceWithWorkIdInt } from '~/database/WorkModel';

export default defineEventHandler(async (_event): Promise<PieceWithWorkIdInt[]> => {
  const pieces = await fetchAllPieces();

  return pieces;
});

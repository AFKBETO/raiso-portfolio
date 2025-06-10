import { fetchPieceFromWork } from '~/database/workData';
import type { Locale } from '~/types/locale';

export default defineEventHandler(async (event) => {
  const workId = getRouterParam(event, 'workId');
  const pieceId = getRouterParam(event, 'pieceId');
  if (!workId || !pieceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request',
    });
  }
  const query = getQuery(event);
  const locale = query.locale as Locale || 'fr';
  const piece = await fetchPieceFromWork(workId, pieceId, locale);

  if (!piece) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Piece not found',
    });
  }

  return piece;
});

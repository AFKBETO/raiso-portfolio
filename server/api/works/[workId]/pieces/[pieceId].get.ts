import { isSeries, Work } from "~/types/work";

export default defineEventHandler(async (event) => {
  const workId = getRouterParam(event, 'workId');
  const data = await queryCollection(event, 'works')
    .first();
  const work = data?.results.find(work => work.id === workId);

  if (!work) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Piece not found'
    });
  }

  if (!isSeries(work)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Work is not a Series'
    });
  }
  const pieceId = getRouterParam(event, 'pieceId');

  const piece = work.pieces.find(piece => piece.id === pieceId);
  
  if (!piece) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Piece not found'
    });
  }
  
  return piece;
})

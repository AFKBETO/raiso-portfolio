import { WorkModel } from "~/database/WorkModel";

export default defineEventHandler(async (event) => {
  const workId = getRouterParam(event, 'workId');
  const work = await WorkModel.findById(workId);

  if (!work) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Piece not found'
    });
  }

  if (work.title === 'N/A') {
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

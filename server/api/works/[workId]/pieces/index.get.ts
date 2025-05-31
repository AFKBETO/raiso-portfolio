import { isSeries } from "~/types/work";

export default defineEventHandler(async (event) => {
  const workId = getRouterParam(event, 'workId');
	const data = await queryCollection(event, 'works').first();
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
  
  const query = getQuery(event);
  const page = parseInt(query.page as string || '1');
  const pageSize = parseInt(query.pageSize as string || '10');
  const sliceStart = (page - 1) * pageSize;
  const isPageInvalid = (page < 1) || (sliceStart >= work.pieces.length);
  if (isPageInvalid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page request error'
    });
  }
  const sliceEnd = Math.min(sliceStart + pageSize, work.pieces.length);
  const pieces = work.pieces.sort((pieceA, pieceB) => {
		const dateA = Date.parse(pieceA.date.toString());
    pieceA.date = new Date(dateA);
		const dateB = Date.parse(pieceB.date.toString());
    pieceB.date = new Date(dateB);
		return dateB - dateA;
	}) || [];
  const results = work.pieces.slice(sliceStart, sliceEnd);
  
  const result = {
    count: pieces.length,
    page,
    pageSize,
    results
  };
  return result;
})

import { PieceInt, WorkInt, WorkModel } from "~/database/WorkModel";

export default defineEventHandler(async (event): Promise<WorkInt | PieceInt> => {
  const workId = getRouterParam(event, 'workId');
	const work = await WorkModel.findById(workId);
	if (!work) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Work not found'
    });
  }
  if (work.title === 'N/A') {
    return work.pieces[0];
  }
	return work;
})

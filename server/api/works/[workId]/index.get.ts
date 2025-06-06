import { getWorkDetailLocaleFromId } from "~/database/workData";
import { PieceLocaleInt, WorkLocaleInt } from "~/database/WorkModel";
import { Locale } from "~/types/locale";

export default defineEventHandler(async (event): Promise<WorkLocaleInt | PieceLocaleInt> => {
  const workId = getRouterParam(event, 'workId');
  if (!workId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request'
    });
  }
  const query = getQuery(event);
  const locale = query.locale as Locale || 'fr';
	const work = await getWorkDetailLocaleFromId(workId, locale);
	if (!work) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Work not found'
    });
  }
	return work;
})

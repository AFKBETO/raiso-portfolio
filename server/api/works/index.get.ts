import { WorkInt, WorkModel } from "~/database/WorkModel";
import { Page } from "~/types/page";

export default defineEventHandler(async (event): Promise<Page<WorkInt>> => {
  const data = await WorkModel.find();
  const works = data.sort((workA, workB) => {
    return workB.year - workA.year;
  }) || [];
	const query = getQuery(event);
  const page = parseInt(query.page as string || '1');
  const pageSize = parseInt(query.pageSize as string || '10');
  const sliceStart = (page - 1) * pageSize;
  const isPageInvalid = (page < 1) || (sliceStart >= works.length);
  if (isPageInvalid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page request error'
    });
  }
  const sliceEnd = Math.min(sliceStart + pageSize, works.length);
  const results = works.slice(sliceStart, sliceEnd);
  
  const result = {
    count: works.length,
    page,
    pageSize,
    results
  };
	
	return result;
})

export default defineEventHandler(async (event) => {
	const data = await queryCollection(event, 'works')
		.first();
	
	const works = data?.results.sort((workA, workB) => {
		const dateA = Date.parse(workA.date.toString());
		workA.date = new Date(dateA);
		const dateB = Date.parse(workB.date.toString());
		workB.date = new Date(dateB);
		return dateB - dateA;
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

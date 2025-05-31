export default defineEventHandler(async (event) => {
  const workId = getRouterParam(event, 'workId')
	const data = await queryCollection(event, 'works')
		.first();
  const work = data?.results.find(work => work.id === workId);
	if (!work) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Work not found'
    });
  }
	return work;
})

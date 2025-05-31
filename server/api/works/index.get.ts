export default defineEventHandler(async (event) => {
	const data = await queryCollection(event, 'works')
		.first();
	return data;
})

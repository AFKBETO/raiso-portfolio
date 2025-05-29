<script setup lang="ts">
const route = useRoute();
const locale = 'fr';

const slug = route.params.slug;

definePageMeta({
	colorMode: 'light',
});

console.log('route', route.path);

const { data } = await useAsyncData(route.path, () => {
	return queryCollection('content')
		.path(route.path + '/' + locale)
		.first();
}) 

useSeoMeta({
	title: data.value?.title,
	description: data.value?.description
});
</script>

<template>
	<div class="w-full prose m-auto py-4 px-10 !max-w-none">
		<ContentRenderer v-if="data" :value="data"/>
		<div v-else>{{ route.params.slug }} not found</div>
	</div>
</template>

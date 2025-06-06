<template>
	<div class="w-full m-auto py-4 px-10 flex flex-col-reverse md:flex-row gap-10">
		<WorkTimeline class="basis-2xs" />
		<Showcase />
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	colorMode: 'light',
})
</script>

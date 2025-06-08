<template>
	<div class="w-full m-auto py-4 px-10 flex flex-col-reverse md:flex-row gap-10">
		<WorkTimeline class="basis-2xs" />
		<PortfolioShowcase />
	</div>
</template>

<script setup lang="ts">
import PortfolioShowcase from '~/components/PortfolioShowcase.vue';

definePageMeta({
	colorMode: 'light',
})
</script>

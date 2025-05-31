<script setup lang="ts">
const locale = 'fr';

const { data: headerLabels } = await useAsyncData('/header', () => {
	return queryCollection('header')
		.where('language', '=', locale)
		.first();
});
</script>

<template>
  <header class="px-20 bg-white w-full flex flex-row content-center justify-between">
    <ULink as="button" to="/">
			<img src="/logo.png" alt="Logo" class="h-20 w-80 rounded-full" />
		</ULink>
		<nav class="flex flex-row content-center gap-4 my-auto">
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/">
				{{ headerLabels?.home }}
			</ULink>
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/about">
				{{ headerLabels?.about }}
			</ULink>
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/activities">
				{{ headerLabels?.activities }}
			</ULink>
			<UIcon name="i-lucide-mail" class="!size-8" />
			<UIcon name="i-lucide-instagram" class="!size-8" />
		</nav>
  </header>
</template>
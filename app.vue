<script setup lang="ts">
const locale = 'fr';

const { data: navbarLabels } = await useAsyncData('/', () => {
	return queryCollection('navbar')
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
				{{ navbarLabels?.home }}
			</ULink>
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/about">
				{{ navbarLabels?.about }}
			</ULink>
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/activities">
				{{ navbarLabels?.activities }}
			</ULink>
			<UIcon name="i-lucide-mail" class="!size-8" />
			<UIcon name="i-lucide-instagram" class="!size-8" />
		</nav>
	</header>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtPage />
	</div>
	<footer class="fixed bottom-0 left-0 p-10 bg-neutral dark:bg-neutral-900 w-full">
		{{ navbarLabels?.footer }}

		<ScrollToTopButton />
	</footer>
</template>

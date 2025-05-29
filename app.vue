<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const locale = 'fr';

definePageMeta({
	colorMode: 'light',
});

const { data: navbarLabels } = await useAsyncData('/', () => {
	return queryCollection('navbar')
		.where('language', '=', locale)
		.first();
});

const items = ref<NavigationMenuItem[][]>([
	[
		{
			to: '/',
			slot: 'logo',
			class: 'flex-none'
		},
	],
	[
		{
			to: '/',
			slot: 'home',
		},
		{
			to: '/about',
			slot: 'about',
		},
		{
			to: '/activities',
			slot: 'activities',
		},
		{
			to: '/contact',
			slot: 'contact',
		},
	]
]);
</script>

<template>
	<header>
		<UNavigationMenu color="neutral" variant="link" :items="items" class="flex justify-around">
			<template #logo>
				<img src="/logo.png" alt="Logo" class="h-16 rounded-full" />
			</template>
			<template #home-label>
				{{ navbarLabels.home }}
			</template>
			<template #about-label>
				{{ navbarLabels.about }}
			</template>
			<template #activities-label>
				{{ navbarLabels.activities }}
			</template>
			<template #contact-label>
				{{ navbarLabels.contact }}
			</template>
		</UNavigationMenu>
	</header>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtPage />
	</div>
</template>

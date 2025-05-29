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
			slot: 'logo'
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
			slot: 'mail'
		},
		{
			slot: 'instagram'
		}
	]
]);

const ui = {
	childItem: ''
}
</script>

<template>
	<header>
		<UNavigationMenu color="neutral" variant="link" :items="items" class="mx-20">
			<template #logo>
				<img src="/logo.png" alt="Logo" class="h-20 w-80 rounded-full" />
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
			<template #mail>
				<UIcon name="i-lucide-mail" class="!size-8" />
			</template>
			<template #instagram>
				<UIcon name="i-lucide-instagram" class="!size-8" />
			</template>
		</UNavigationMenu>
	</header>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtPage />
	</div>
</template>

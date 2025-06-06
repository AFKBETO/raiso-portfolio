<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
	showHorizontalNavbar: boolean
}>();

const locale = 'fr';

const { data: headerLabels } = await useAsyncData('/header', () => {
	return queryCollection('header')
		.where('language', '=', locale)
		.first();
});

const isSlideoverOpen = ref(false);

function closeSlideover(){
	isSlideoverOpen.value = false;
}

const verticalItems = ref<NavigationMenuItem[][]>([[
	{
		label: headerLabels.value?.about,
		to: '/about',
		onSelect: closeSlideover
	},
	{
		label: headerLabels.value?.activities,
		to: '/activities',
		onSelect: closeSlideover
	},
	{
		label: 'Email',
		icon: 'i-lucide-mail',
		href: 'mailto:buithuhuong0804@gmail.com',
		onSelect: closeSlideover
	},
	{
		label: 'Instagram',
		icon: 'i-lucide-instagram',
		href: "https://www.instagram.com/raisohoho/",
		target: "_blank",
		onSelect: closeSlideover
	}
]]);
</script>

<template>
  <header class="px-20 bg-white w-full flex flex-row content-center justify-between">
    <ULink as="button" to="/">
			<img src="/logo.png" alt="Logo" class="h-20 w-80 rounded-full" />
		</ULink>
		<nav v-if="showHorizontalNavbar" class="flex flex-row content-center gap-4 my-auto">
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/">
				{{ headerLabels?.home }}
			</ULink>
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/about">
				{{ headerLabels?.about }}
			</ULink>
			<ULink class="content-center text-black" active-class="underline underline-offset-2" as="button" to="/activities">
				{{ headerLabels?.activities }}
			</ULink>
			<ULink href="mailto:buithuhuong0804@gmail.com">
				<UIcon name="i-lucide-mail" class="!size-8" />
			</ULink>
			<ULink href="https://www.instagram.com/raisohoho/" target="_blank" external>
				<UIcon name="i-lucide-instagram" class="!size-8" />
			</ULink>
		</nav>
		<template v-else>
			<USlideover
				v-model:open="isSlideoverOpen"
				:close="{
				color: 'error',
				variant: 'outline',
				class: 'rounded-full'
			}">
				<UButton label="Open" color="neutral" variant="subtle" />

				<template #body>
					<UNavigationMenu orientation="vertical" :items="verticalItems" class="data-[orientation=vertical]:w-48" />
				</template>
			</USlideover>
		</template>
  </header>
</template>
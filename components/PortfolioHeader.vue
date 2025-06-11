<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';

const isLargeScreen = useLargeScreen();

const locale = useNuxtLocale();

const { data: headerLabels } = await useAsyncData('/header', () => {
  return queryCollection('header')
    .where('language', '=', locale.value)
    .first()
    || queryCollection('header')
      .where('language', '=', 'fr')
      .first();
}, {
  watch: [locale],
});

const isSlideoverOpen = useSlideoverOpen();

const verticalItems = ref<NavigationMenuItem[][]>([[
  {
    label: headerLabels.value?.home,
    to: '/',
  },
  {
    label: headerLabels.value?.about,
    to: '/about',
  },
  {
    label: headerLabels.value?.activities,
    to: '/activities',
  },
  {
    label: 'Email',
    icon: 'i-lucide-mail',
    href: 'mailto:buithuhuong0804@gmail.com',
  },
  {
    label: 'Instagram',
    icon: 'i-lucide-instagram',
    href: 'https://www.instagram.com/raisohoho/',
    target: '_blank',
  },
]]);

function getFlagIcon() {
  return locale.value === 'en' ? 'i-cif-gb' : 'i-cif-fr';
}

const localeItems = ref<DropdownMenuItem[]>([
  {
    icon: 'i-cif-gb',
    onClick: () => {
      locale.value = 'en';
    },
  },
  {
    icon: 'i-cif-fr',
    onClick: () => {
      locale.value = 'fr';
    },
  },
]);
</script>

<template>
  <header class="px-20 bg-white w-full flex flex-row content-center justify-between">
    <ULink
      as="button"
      to="/"
    >
      <img
        src="/logo.png"
        alt="Logo"
        class="h-20 w-80 rounded-full"
      >
    </ULink>
    <nav
      v-if="isLargeScreen"
      class="flex flex-row content-center gap-4 my-auto"
    >
      <ULink
        class="content-center text-black"
        active-class="underline underline-offset-2"
        as="button"
        to="/"
      >
        {{ headerLabels?.home }}
      </ULink>
      <ULink
        class="content-center text-black"
        active-class="underline underline-offset-2"
        as="button"
        to="/about"
      >
        {{ headerLabels?.about }}
      </ULink>
      <ULink
        class="content-center text-black"
        active-class="underline underline-offset-2"
        as="button"
        to="/activities"
      >
        {{ headerLabels?.activities }}
      </ULink>
      <ULink href="mailto:buithuhuong0804@gmail.com">
        <UIcon
          name="i-lucide-mail"
          class="!size-8"
        />
      </ULink>
      <ULink
        href="https://www.instagram.com/raisohoho/"
        target="_blank"
        external
      >
        <UIcon
          name="i-lucide-instagram"
          class="!size-8"
        />
      </ULink>
      <UDropdownMenu
        :items="localeItems"
        :content="{
          align: 'start',
          side: 'bottom',
          sideOffset: 8,
        }"
      >
        <UIcon
          :name="getFlagIcon()"
          class="!size-8"
        />
      </UDropdownMenu>
    </nav>
    <template v-else>
      <div class="content-center">
        <USlideover
          v-model:open="isSlideoverOpen"
          close
        >
          <UButton
            size="xl"
            icon="i-lucide-menu"
            color="neutral"
            variant="subtle"
          />

          <template #body>
            <UNavigationMenu
              orientation="vertical"
              :items="verticalItems"
              class="data-[orientation=vertical]:w-48"
            />
          </template>
        </USlideover>
      </div>
    </template>
  </header>
</template>

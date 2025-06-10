<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const isLargeScreen = useLargeScreen();

const locale = 'fr';

const { data: headerLabels } = await useAsyncData('/header', () => {
  return queryCollection('header')
    .where('language', '=', locale)
    .first();
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

<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';

const isLargeScreen = useLargeScreen();

const locale = useNuxtLocale();

const { data: headerLabels } = await useAsyncData('/header', async () => {
  const header = await queryCollection('header')
    .where('language', '=', locale.value)
    .first();
  if (header) {
    return header;
  }
  return await queryCollection('header')
    .where('language', '=', 'fr')
    .first();
}, {
  watch: [locale],
});

const iconFr = 'i-flag-fr-1x1';
const iconEn = 'i-flag-gb-1x1';
const iconCircleFr = 'i-circle-flags-fr';
const iconCircleEn = 'i-circle-flags-en';

const flagCircleIcon = computed(() => locale.value === 'en' ? iconCircleEn : iconCircleFr);
const flagSquareIcon = computed(() => locale.value === 'en' ? iconEn : iconFr);

const localeItems = ref<DropdownMenuItem[]>([
  {
    icon: iconEn,
    label: 'English',
    onClick: () => {
      locale.value = 'en';
    },
  },
  {
    icon: iconFr,
    label: 'Français',
    onClick: () => {
      locale.value = 'fr';
    },
  },
]);

const isSlideoverOpen = useSlideoverOpen();

const verticalItems = computed<NavigationMenuItem[][]>(() => [[
  {
    label: headerLabels.value?.home,
    to: '/',
  },
  {
    label: headerLabels.value?.about,
    to: '/about',
  },
  {
    label: headerLabels.value?.shop,
    to: '/shop',
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
  {
    label: 'User',
    icon: 'i-lucide-user',
    to: '/carts',
  },
  {
    slot: 'flag',
    children: [{
      icon: iconEn,
      label: 'English',
      onSelect: () => {
        isSlideoverOpen.value = false;
        locale.value = 'en';
      },
    },
    {
      icon: iconFr,
      label: 'Français',
      onSelect: () => {
        isSlideoverOpen.value = false;
        locale.value = 'fr';
      },
    }],
  },
]]);
</script>

<template>
  <header class="px-4 sm:px-7 md:px-10 lg:px-20 bg-white w-full flex flex-row content-center justify-between">
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
    <div class="flex flex-row gap-2 align-center content-center">
      <nav
        v-if="isLargeScreen"
        class="flex flex-row content-center gap-4 my-auto align-center"
      >
        <ULink
          class="content-center text-black "
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
          to="/shop"
        >
          {{ headerLabels?.shop }}
        </ULink>
        <ULink
          href="mailto:buithuhuong0804@gmail.com"
          class="align-center"
        >
          <UIcon
            name="i-lucide-mail"
            class="!size-8"
          />
        </ULink>
        <ULink
          href="https://www.instagram.com/raisohoho/"
          target="_blank"
          external
          class="align-center"
        >
          <UIcon
            name="i-lucide-instagram"
            class="!size-8"
          />
        </ULink>
        <ULink
          class="align-center"
          as="button"
          to="/carts"
        >
          <UIcon
            name="i-lucide-user"
            class="!size-8"
          />
        </ULink>
        <UDropdownMenu
          :items="localeItems"
          :content="{
            align: 'end',
          }"
        >
          <ULink
            class="align-center"
          >
            <UIcon
              :name="flagCircleIcon"
              class="!size-7"
            />
          </ULink>
        </UDropdownMenu>
      </nav>
      <template v-else>
        <div class="content-center">
          <USlideover
            v-model:open="isSlideoverOpen"
            keepalive
          >
            <UButton
              size="xl"
              icon="i-lucide-menu"
              color="neutral"
              variant="ghost"
            />
            <template #body>
              <UNavigationMenu
                keepalive
                orientation="vertical"
                :items="verticalItems"
                class="data-[orientation=vertical]:w-48"
              >
                <template #flag>
                  <UIcon
                    :name="flagSquareIcon"
                  />
                </template>
              </UNavigationMenu>
            </template>
          </USlideover>
        </div>
      </template>
      <CartComponent />
    </div>
  </header>
</template>

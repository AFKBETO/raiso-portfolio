<script setup lang="ts">
const largeScreen = useLargeScreen();

function updateNavbar() {
  const width = window.innerWidth;
  largeScreen.value = width >= 768;
}

const locale = useNuxtLocale();

const { data: _cartLabels } = await useAsyncData('/cart', async () => {
  const cart = await queryCollection('cart')
    .where('language', '=', locale.value)
    .first();
  if (cart) {
    return cart;
  }
  return queryCollection('cart')
    .where('language', '=', 'fr')
    .first();
}, {
  watch: [locale],
});

onMounted(() => {
  updateNavbar();
  window.addEventListener('resize', updateNavbar);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateNavbar);
});
</script>

<template>
  <UApp>
    <body class="flex flex-col min-h-screen">
      <PortfolioHeader keepalive />
      <main class="grow">
        <NuxtRouteAnnouncer />
        <NuxtPage keepalive />
      </main>
      <PortfolioFooter />
    </body>
  </UApp>
</template>

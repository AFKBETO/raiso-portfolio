<script setup lang="ts">
const largeScreen = useLargeScreen();

function updateNavbar() {
  const width = window.innerWidth;
  largeScreen.value = width >= 768;
}

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

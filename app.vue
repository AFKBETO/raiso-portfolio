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
		<PortfolioHeader keepalive />
		<NuxtRouteAnnouncer />
		<NuxtPage keepalive />
		<PortfolioFooter />
	</UApp>
</template>

<script setup lang="ts">

const showHorizontalNavbar = useHorizontalNavbar();

function updateNavbar() {
	const width = window.innerWidth;
	showHorizontalNavbar.value = width >= 768;
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

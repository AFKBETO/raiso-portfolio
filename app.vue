<script setup lang="ts">

const showHorizontalNavbar = ref(false);

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
		<PortfolioHeader :showHorizontalNavbar="showHorizontalNavbar" />
		<NuxtRouteAnnouncer />
		<NuxtPage />
		<PortfolioFooter />
	</UApp>
</template>

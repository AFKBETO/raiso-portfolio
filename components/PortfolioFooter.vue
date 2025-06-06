<script setup lang="ts">
	const locale = 'fr';

	const { data: footerLabels } = await useAsyncData('/footer', () => {
		return queryCollection('footer')
			.where('language', '=', locale)
			.first();
	});

	const visible = "!fixed bottom-5 end-5 rounded-full";
  const invisible = visible + " invisible";
  const classNames = ref(invisible);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleScroll() {
    if (window.scrollY > 0) {
      classNames.value = visible;
    } else {
      classNames.value = invisible;
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<template>
  <footer class="fixed bottom-0 left-0 p-10 bg-neutral dark:bg-neutral-900 w-full">
		{{ footerLabels?.body }}
		<UButton
			color="neutral"
			:class="classNames"
			@click="scrollToTop"
			icon="i-lucide-triangle"
			variant="outline">
		</UButton>
	</footer>
</template>
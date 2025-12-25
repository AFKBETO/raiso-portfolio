<script setup lang="ts">
const locale = useNuxtLocale();

const { data: footerLabels } = await useAsyncData('/footer', () => {
  return queryCollection('footer')
    .where('language', '=', locale.value)
    .first()
    || queryCollection('footer')
      .where('language', '=', 'fr')
      .first();
}, {
  watch: [locale],
});

const classNames = ref('');

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScroll() {
  if (window.scrollY > 0) {
    classNames.value = '';
  }
  else {
    classNames.value = 'invisible';
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <footer class="p-6 bg-white dark:bg-neutral-900 w-full justify-around flex flex-row mt-auto">
    <p>
      {{ footerLabels?.body }}
    </p>
    <ULink
      to="/legal"
    >Mentions légales</ULink>
    <UTooltip text="Scroll to top">
      <UButton
        size="xl"
        color="neutral"
        class="!fixed bottom-10 end-10 rounded-full"
        :class="classNames"
        icon="i-lucide-triangle"
        variant="outline"
        @click="scrollToTop"
      />
    </UTooltip>
  </footer>
</template>

<template>
  <UButton
    color="neutral"
    :class="classNames"
    @click="scrollToTop"
    icon="i-lucide-triangle"
    variant="outline">
  </UButton>
</template>

<script setup lang="ts">
  const visible = "!fixed bottom-5 end-5 rounded-full";
  const invisible = visible + " invisible";
  const classNames = ref();

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
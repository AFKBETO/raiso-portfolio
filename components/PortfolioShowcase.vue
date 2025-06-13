<script setup lang="ts">
import type { WorkImgInt } from '~/database/WorkModel';

const { data: showcases } = await useFetch<WorkImgInt[]> ('/api/showcases');
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center justify-around md:justify-normal md:m-auto">
    <ULink
      v-for="work in showcases"
      :key="work._id"
      :to="`/works/${work._id}`"
      class="items-center"
    >
      <img
        width="100%"
        class="aspect-square object-scale-down"
        :alt="work.title"
        :src="parseImageSrc(work.imageUrl, 300)"
      >
    </ULink>
  </div>
</template>

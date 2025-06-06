<script setup lang="ts">
import type { ShowcaseImgInt } from '~/database/ShowcaseModel';

const { data } = await useFetch<ShowcaseImgInt> ('/api/showcases');

</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <ULink
      :to="`/works/${work._id}`"
      v-for="work in data?.showcases"
      :key="work._id"
      class="items-center">
      <img 
        width="300"
        class="aspect-square object-scale-down"
        :alt="work.title"
        :src="`${work.imageUrl}?width=300`" >
    </ULink>
  </div>
</template>
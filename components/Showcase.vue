<script setup lang="ts">
import type { ShowcaseImgInt } from '~/database/ShowcaseModel';

const { data } = await useFetch<ShowcaseImgInt> ('/api/showcases');

</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <NuxtLink
      :to="`/works/${work._id}`"
      v-for="work in data?.showcases"
      :key="work._id">
      <NuxtPicture 
        width="400"
        height="400"
        :alt="work.title"
        :src="work.imageUrl" />
    </NuxtLink>
  </div>
</template>
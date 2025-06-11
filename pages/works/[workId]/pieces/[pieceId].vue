<script setup lang="ts">
import PieceComponent from '~/components/PieceComponent.vue';
import type { PieceLocaleInt } from '~/database/WorkModel';

const locale = useNuxtLocale();
const route = useRoute();
const { workId, pieceId } = route.params;

const { data } = await useFetch<PieceLocaleInt> (`/api/works/${workId}/pieces/${pieceId}`, {
  query: { locale: locale },
  key: `piece-${workId}-${pieceId}`,
});

definePageMeta({
  colorMode: 'light',
});

useSeoMeta({
  title: data.value?.title,
  description: data.value?.description,
  articleTag: data.value?.tags,
  ogTitle: data.value?.title,
  ogDescription: data.value?.description,
  ogImage: getSeoImage(data.value),
  ogUrl: `https://buithuhuong.work/works/${workId}/pieces/${pieceId}`,
  twitterTitle: data.value?.title,
  twitterDescription: data.value?.description,
  twitterImage: getSeoImage(data.value),
  twitterCard: 'summary',
});

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
  ],
});
</script>

<template>
  <div class="w-full m-auto p-10 flex">
    <template v-if="data === null">
      Item not found
    </template>
    <template v-else>
      <PieceComponent :piece="data" />
    </template>
  </div>
</template>

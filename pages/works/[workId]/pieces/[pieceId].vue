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

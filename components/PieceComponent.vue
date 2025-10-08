<script setup lang="ts">
import type { PieceLocaleInt } from '~/database/WorkModel';

const { piece } = defineProps<{
  piece: PieceLocaleInt;
}>();

const locale = useNuxtLocale();

const { data: pieceLabels } = await useAsyncData('/pieceLabels', async () => {
  const pieceLabels = await queryCollection('piece')
    .where('language', '=', locale.value)
    .first();
  if (pieceLabels) {
    return pieceLabels;
  }
  return await queryCollection('piece')
    .where('language', '=', 'fr')
    .first();
}, {
  watch: [locale],
});

const paragraphs = computed(() => piece.description.split('\\n'));
</script>

<template>
  <div class="w-full m-auto py-8 px-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    <img
      :src="parseImageSrc(piece.imageUrl, 1000)"
      :alt="piece.title"
      class="aspect-square object-scale-down w-full"
    >
    <div>
      <p class="text-xl">
        {{ piece.title }}
      </p>
      <p
        v-if="piece.workId"
      >
        {{ pieceLabels?.work }}: <ULink :to="`/works/${piece.workId}`">{{ piece.workTitle }}</ULink>
      </p>
      <p>
        {{ pieceLabels?.year }}: {{ piece.year }}
      </p>
      <p
        v-if="piece.material && piece.material !== '' && piece.material !== 'N/A'"
      >
        {{ pieceLabels?.materials }}: {{ piece.material }}
      </p>
      <p
        v-if="piece.dimension && piece.dimension !== '' && piece.dimension !== 'N/A'"
        class="pb-6"
      >
        {{ pieceLabels?.dimension }}: {{ piece.dimension }}
      </p>
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        class="text-justify"
      >
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

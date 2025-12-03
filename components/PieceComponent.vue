<script setup lang="ts">
import MediaComponent from './MediaComponent.vue';
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

function getTitle(): string {
  if (!!piece.productInfo && piece.productInfo.productTitle !== '') {
    return `${piece.title} | ${piece.productInfo.productTitle}`;
  }
  return piece.title;
}

const paragraphs = computed(() => piece.description.split('\\n'));
</script>

<template>
  <div class="w-full m-auto py-8 px-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    <div class="flex flex-col items-center gap-2">
      <MediaComponent
        width="100%"
        :media-width="1000"
        class="aspect-square object-scale-down"
        :alt="piece.title"
        :src="piece.imageUrls[piece.primaryImageIndex]"
      />
      <template v-for="i in piece.imageUrls.keys()">
        <MediaComponent
          v-if="i !== piece.primaryImageIndex"
          :key="i"
          width="100%"
          :media-width="1000"
          class="aspect-square object-scale-down"
          :alt="piece.title + ' - ' + (i + 1)"
          :src="piece.imageUrls[piece.primaryImageIndex]"
        />
      </template>
    </div>
    <div>
      <p class="text-xl">
        {{ getTitle() }}
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
        class="text-justify py-4"
      >
        {{ paragraph }}
      </p>
      <div v-if="!!piece.productInfo">
        <p>
          {{ parsePrice(piece.productInfo.price) }} €
        </p>
      </div>
    </div>
  </div>
</template>

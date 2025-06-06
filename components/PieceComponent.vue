<script setup lang="ts">
import type { PieceLocaleInt } from '~/database/WorkModel';

const { piece } = defineProps<{
  piece: PieceLocaleInt
}>()

const paragraphs = piece.description.split('\\n');

</script>

<template>
  <div class="w-full m-auto py-8 px-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    <img
      :src="`${piece.imageUrl}?width=1000`"
      :alt="piece.title"
      class="aspect-square object-scale-down w-full">
    <div>
      <p class="text-xl">
        {{ piece.title }}
      </p>
      <p>
        {{ piece.year }}
      </p>
      <p>
        {{ piece.material }}
      </p>
      <p class="pb-6">
        Dimension: {{ piece.dimension }}
      </p>
      <p v-for="paragraph in paragraphs" class="text-justify">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>
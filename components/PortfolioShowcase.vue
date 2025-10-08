<script setup lang="ts">
import type { PieceWithWorkIdInt } from '~/database/WorkModel';

const { data: pieces } = await useFetch<PieceWithWorkIdInt[]> ('/api/pieces?isShow=true');

function parseLink(piece: PieceWithWorkIdInt) {
  if (!piece.workId) {
    return `/works/${piece._id}`;
  }

  return `/works/${piece.workId}/pieces/${piece._id}`;
}
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center justify-around md:justify-normal md:m-auto">
    <ULink
      v-for="piece in pieces"
      :key="piece._id"
      :to="parseLink(piece)"
      class="items-center"
    >
      <img
        width="100%"
        class="aspect-square object-scale-down"
        :alt="piece.title"
        :src="parseImageSrc(piece.imageUrl, 300)"
      >
    </ULink>
  </div>
</template>

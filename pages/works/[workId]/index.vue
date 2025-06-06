<script setup lang="ts">
import type { PieceInt, WorkInt } from '~/database/WorkModel';

const route = useRoute();
const workId = route.params.workId;

const { data } = await useFetch<WorkInt | PieceInt> (`/api/works/${workId}`);

function getUI(item: any[]) {
  if (item.length === 3) {
    return { item: 'basis-1/3' };
  }
  if (item.length === 2) {
    return { item: 'basis-1/2' };
  }
  return undefined;
  
}

definePageMeta({
	colorMode: 'light',
})
</script>

<template>
	<div class="w-full m-auto py-4 px-10 flex">
    <template v-if="data === null">
      Item not found
    </template>
    <template v-else-if="isPiece(data)">
      Piece
    </template>
    <template v-else>
      <div class="m-auto">
        <p class="text-2xl text-center font-sans my-4 font-bold">
          {{ data.title.toLocaleUpperCase() }}
        </p>
        <UCarousel
          v-slot="{ item }"
          :items="data.pieces"
          :ui="getUI(data.pieces)"
          arrows
          dots>
          <ULink :to="`/works/${workId}/pieces/${item._id}`">
            <NuxtPicture
              :src="`${item.imageUrl}?width=300`"
              :alt="item.title"
              width="300"
              height="300" />
          </ULink>
          <ULink as="button" class="w-full block m-auto text-lg text-center font-sans my-4" :to="`/works/${workId}/pieces/${item._id}`">
            {{ item.title }}
          </ULink>
        </UCarousel>
      </div>
    </template>
	</div>
</template>



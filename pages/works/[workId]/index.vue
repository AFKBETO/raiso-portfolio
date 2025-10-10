<script setup lang="ts">
import PieceComponent from '~/components/PieceComponent.vue';
import type { WorkLocaleInt, PieceLocaleInt } from '~/database/WorkModel';

const locale = useNuxtLocale();
const route = useRoute();
const workId = route.params.workId;

const { data } = await useFetch<WorkLocaleInt | PieceLocaleInt> (`/api/works/${workId}`, {
  key: `work-${workId}`,
  query: { locale: locale },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUI(items: any[]) {
  if (items.length >= 3) {
    return { item: 'flex flex-col md:basis-1/2 lg:basis-1/3' };
  }
  if (items.length === 2) {
    return { item: 'flex flex-col md:basis-1/2' };
  }
  return { item: 'flex flex-col' };
}

const showArrows = ref(false);

function updateShowArrows() {
  if (!data.value || isPiece(data.value)) {
    showArrows.value = false;
    return;
  }
  const count = data.value.pieces.length;
  const width = window.innerWidth;
  if (width >= 1024) {
    showArrows.value = count > 3;
  }
  else if (width >= 768) {
    showArrows.value = count > 2;
  }
  else {
    showArrows.value = count > 1;
  }
}

const paragraphs = computed(() => data.value?.description.split('\\n'));

onMounted(() => {
  updateShowArrows();
  window.addEventListener('resize', updateShowArrows);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateShowArrows);
});

definePageMeta({
  colorMode: 'light',
});

function getSeoDescription() {
  if (isPiece(data.value)) {
    return data.value.description;
  }
  return data.value?.title || '';
}

function getSeoTags() {
  if (isPiece(data.value)) {
    return data.value.tags;
  }
  return undefined;
}

useSeoMeta({
  title: data.value?.title,
  description: getSeoDescription(),
  articleTag: getSeoTags(),
  ogTitle: data.value?.title,
  ogDescription: getSeoDescription(),
  ogImage: getSeoImage(data.value),
  ogUrl: `https://buithuhuong.work/works/${workId}`,
  twitterTitle: data.value?.title,
  twitterDescription: getSeoDescription(),
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
    <template v-else-if="isPiece(data)">
      <PieceComponent :piece="data" />
    </template>
    <template v-else>
      <div class="m-auto">
        <p class="text-2xl text-center font-sans mb-6 font-bold">
          {{ data.title.toLocaleUpperCase() }}
        </p>
        <div
          v-for="(paragraph, index) in paragraphs"
          :key="index"
          class="my-4"
        >
          <p class="text-justify">
            {{ paragraph }}
          </p>
        </div>
        <UCarousel
          v-slot="{ item }"
          class="w-[300px] md:w-[600px] lg:w-full"
          :items="data.pieces"
          :ui="getUI(data.pieces)"
          :arrows="showArrows"
          :dots="showArrows"
        >
          <ULink :to="`/works/${workId}/pieces/${item._id}`">
            <img
              :src="parseImageSrc(item.imageUrl, 300)"
              :alt="item.title"
              width="300"
              class="aspect-square object-scale-down w-full"
            >
          </ULink>
          <UButton
            as="button"
            color="neutral"
            variant="outline"
            class=" w-full rounded-none hover:bg-black justify-center hover:text-white !text-center font-sans font-bold my-4"
            :to="`/works/${workId}/pieces/${item._id}`"
          >
            {{ item.title }}
          </UButton>
        </UCarousel>
      </div>
    </template>
  </div>
</template>

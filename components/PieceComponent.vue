<script setup lang="ts">
import type { PieceLocaleInt } from '~/database/WorkModel';

const { piece } = defineProps<{
  piece: PieceLocaleInt;
}>();

const locale = useNuxtLocale();
const cart = useCart();
const isCartFeatureEnabled = useFeatureFlag('cart');

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
const quantity = ref(piece.productInfo?.minQuantity || 0);

function onClick() {
  if (!quantity.value) {
    return;
  }
  const cartItems = { ...cart.value };
  const item = cartItems[piece.workId + '-' + piece._id];
  if (item) {
    item.quantity += quantity.value;
  }
  else {
    cartItems[piece.workId + '-' + piece._id] = {
      workId: piece.workId,
      pieceId: piece._id,
      quantity: quantity.value,
    };
  }
  cart.value = { ...cartItems };
}
function strikethrough(baseClass: string): string {
  if (piece.productInfo && piece.productInfo.isSoldout) {
    return `${baseClass} line-through`;
  }
  return baseClass;
}
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
        v-if="piece.workId && piece.workTitle"
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
      <div
        v-if="!!piece.productInfo"
        class="flex justify-start content-center gap-2 my-2"
      >
        <div
          :class="strikethrough('content-center')"
        >
          {{ parsePrice(piece.productInfo.price) }} €
        </div>
        <UInputNumber
          v-model="quantity"
          :min="piece.productInfo.minQuantity ?? 0"
          :max="piece.productInfo.maxQuantity > 0 ? piece.productInfo.maxQuantity : undefined"
          :disabled="piece.productInfo.isSoldout || !isCartFeatureEnabled"
          :color="piece.productInfo.isSoldout ? 'neutral' : 'primary'"
        />
        <UButton
          loading-auto
          :disabled="piece.productInfo.isSoldout || !isCartFeatureEnabled"
          :variant="piece.productInfo.isSoldout ? 'outline' : 'solid'"
          :color="piece.productInfo.isSoldout ? 'neutral' : 'primary'"
          @click="() => onClick()"
        >
          {{ pieceLabels?.addToCart }}
        </UButton>
      </div>
    </div>
  </div>
</template>

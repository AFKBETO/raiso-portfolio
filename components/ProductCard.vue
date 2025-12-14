<script setup lang="ts">
import type { ProductCardInt } from '~/database/WorkModel';

const { product } = defineProps<{
  product: ProductCardInt;
}>();

function parseLink(): string {
  if (!product.workId) {
    return `/works/${product._id}`;
  }

  return `/works/${product.workId}/pieces/${product._id}`;
}

function parseTitle(): string {
  if (!product.productTitle) {
    return product.title;
  }
  return `${product.title} | ${product.productTitle}`;
}
</script>

<template>
  <ULink
    :to="parseLink()"
    class="items-center"
  >
    <UCard variant="outline">
      <img
        width="100%"
        class="aspect-square object-scale-down"
        :alt="product.productTitle"
        :src="parseImageSrc(product.imageUrl, 300)"
      >

      <template #footer>
        <div class="flex flex-col items-center">
          <p class="font-semibold">
            {{ parseTitle() }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ parsePrice(product.price) }}
          </p>
        </div>
      </template>
    </UCard>
  </ULink>
</template>

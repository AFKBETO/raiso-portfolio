<script setup lang="ts">
import ProductCard from '~/components/ProductCard.vue';
import type { ProductCardInt } from '~/database/WorkModel';

const { data: products } = await useFetch<ProductCardInt[]>('/api/products', {
  key: 'products',
});

definePageMeta({
  colorMode: 'light',
});
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center justify-around md:justify-normal md:m-auto p-6">
    <ProductCard
      v-for="product in products"
      :key="product._id"
      :product="product"
    />
  </div>
</template>

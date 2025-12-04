<script setup lang="ts">
import ProductCard from '~/components/ProductCard.vue';
import type { ProductCardInt } from '~/database/WorkModel';
import type { Page } from '~/types/page';

const pageNumber = ref(1);
const pageSize = ref(10);

const { data: productQuery } = await useFetch<Page<ProductCardInt>>(`/api/products`, {
  query: {
    pageSize: pageSize,
    pageNumber: pageNumber,
    unavailableIncluded: false,
  },
  key: 'product-query',
});

definePageMeta({
  colorMode: 'light',
});
</script>

<template>
  <div
    class="flex flex-col"
  >
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center justify-around md:justify-normal md:m-auto p-6">
      <ProductCard
        v-for="product in productQuery?.results"
        :key="product._id"
        :product="product"
      />
    </div>
    <UPagination
      v-model:page="pageNumber"
      class="mx-auto"
      :total="productQuery?.count"
      :items-per-page="productQuery?.pageSize"
    />
  </div>
</template>

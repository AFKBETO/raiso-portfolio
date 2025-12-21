<script setup lang="ts">
import type { CartCollectionItem } from '@nuxt/content';
import type { TableColumn } from '@nuxt/ui';
import type { CartItemDetailsInt } from '~/database/BuyerModel';

const { cart, loading } = defineProps<{
  cart: CartItemDetailsInt[];
  loading: boolean;
}>();

const tableRef = useTemplateRef('table');

defineExpose({
  tableRef,
});

const { data: cartLabels } = useNuxtData<CartCollectionItem>('/cart');

const columns: TableColumn<CartItemDetailsInt>[] = [
  {
    accessorKey: 'item',
    header: cartLabels.value?.item + 's',
  },
  {
    accessorKey: 'sellPrice',
    header: () => h('div', { class: 'text-center' }, cartLabels.value?.price),
  },
  {
    accessorKey: 'quantity',
    header: () => h('div', { class: 'text-center' }, cartLabels.value?.quantity),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, `${cartLabels.value?.amount} (${cartLabels.value?.withVat})`),
  },
];
</script>

<template>
  <UTable
    ref="table"
    :data="cart"
    :columns="columns"
    class="flex-1"
    :loading="loading"
  >
    <template #item-cell="{ row }">
      <div class="flex items-center gap-3">
        <img
          :src="parseImageSrc(row.original.imageUrl, 100)"
          :alt="parseTitle(row.original)"
          width="50"
          height="50"
          class="mr-2"
        >
        <p class="font-semibold">
          {{ parseTitle(row.original) }}
        </p>
      </div>
    </template>
    <template #sellPrice-cell="{ row }">
      <p class="text-center">
        {{ parsePrice(row.getValue('sellPrice')) }}
      </p>
    </template>
    <template #quantity-cell="{ row }">
      <p class="text-center">
        {{ row.getValue('quantity') }}
      </p>
    </template>
    <template #amount-cell="{ row }">
      <p class="text-right">
        {{ parsePrice(row.getValue<number>('amount')) }}
      </p>
    </template>
  </UTable>
</template>

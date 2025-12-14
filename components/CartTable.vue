<script setup lang="ts">
import type { CartCollectionItem } from '@nuxt/content';
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { CartInfoInt } from '~/database/BuyerModel';
import type { SelectedRow } from '~/types/cart';

const { cart, loading } = defineProps<{
  cart: CartInfoInt[];
  loading: boolean;
}>();
const rowSelection = defineModel<SelectedRow>('row-selection', { default: {} });
const tableRef = useTemplateRef('table');

defineExpose({
  tableRef,
});

const cartCookie = useCart();
const { data: cartLabels } = useNuxtData<CartCollectionItem>('/cart');

const columns: TableColumn<CartInfoInt>[] = [
  {
    id: 'select',
    accessorKey: 'select',
    footer: ({ table }) => {
      const count = table.getFilteredSelectedRowModel().rows.length || 0;
      const total = table.getFilteredRowModel().rows.length || 0;

      return h('span', formatString(cartLabels.value?.selection || '', count, total));
    },
  },
  {
    accessorKey: 'item',
    header: cartLabels.value?.item + 's',
  },
  {
    accessorKey: 'price',
    header: () => h('div', { class: 'text-center' }, cartLabels.value?.price),
  },
  {
    accessorKey: 'quantity',
    header: () => h('div', { class: 'text-center' }, cartLabels.value?.quantity),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, `${cartLabels.value?.amount} (${cartLabels.value?.withVat})`),
    footer: ({ table }) => {
      const total = table.getFilteredRowModel()
        .rows.reduce(
          (acc: number, row: TableRow<CartInfoInt>) => acc + Number.parseInt(row.getValue('amount')),
          0,
        );

      return h('div', { class: 'text-right font-semibold' }, `${cartLabels.value?.total} (${cartLabels.value?.withVat}) ${parsePrice(total)}`);
    },
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
    <template #select-header="{ table }">
      <UCheckbox
        :model-value="table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()"
        aria-label="Select all"
        @update:model-value="(value: boolean | 'indeterminate') => {
          for (const item of cart) {
            rowSelection[item.workId + '-' + item._id] = !!value ? true : undefined;
          }
          table.toggleAllPageRowsSelected(!!value);
        }"
      />
    </template>
    <template #select-cell="{ row }">
      <UCheckbox
        :model-value="row.getIsSelected()"
        aria-label="Select row"
        @update:model-value="(value: boolean | 'indeterminate') => {
          rowSelection[row.original.workId + '-' + row.original._id] = !!value ? true : undefined;
          row.toggleSelected(!!value);
          console.log(rowSelection)
        }"
      />
    </template>
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
    <template #price-cell="{ row }">
      <p class="text-center">
        {{ parsePrice(row.getValue('price')) }}
      </p>
    </template>
    <template #quantity-cell="{ row }">
      <UInputNumber
        v-model="cartCookie[row.original.workId + '-' + row.original._id]!.quantity"
        class="w-20 mx-auto flex"
        size="xs"
        :min="row.original.minQuantity"
        :max="row.original.maxQuantity"
      />
    </template>
    <template #amount-cell="{ row }">
      <p class="text-right">
        {{ parsePrice(row.getValue<number>('amount')) }}
      </p>
    </template>
  </UTable>
</template>

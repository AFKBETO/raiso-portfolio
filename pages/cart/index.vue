<script setup lang="ts">
import type { SelectedRow } from '~/types/cart';

const { status, data: cart } = await useCartInfo();

const cartCookie = useCart();

const locale = useNuxtLocale();

const { data: cartLabels } = await useAsyncData('/cart', async () => {
  const cart = await queryCollection('cart')
    .where('language', '=', locale.value)
    .first();
  if (cart) {
    return cart;
  }
  return queryCollection('cart')
    .where('language', '=', 'fr')
    .first();
}, {
  watch: [locale],
});

const cartTable = useTemplateRef('cartTable');
const unavailableTable = useTemplateRef('unavailableTable');
const rowSelection = useState<SelectedRow>('selected-row', () => ({}));

function onClick() {
  const newValue = { ...cartCookie.value };
  for (const key in rowSelection.value) {
    if (rowSelection.value[key]) {
      newValue[key] = undefined;
      rowSelection.value[key] = undefined;
    }
  }
  cartTable.value?.tableRef?.tableApi.toggleAllPageRowsSelected(false);
  unavailableTable.value?.tableRef?.tableApi.toggleAllPageRowsSelected(false);
  cartCookie.value = newValue;
}

definePageMeta({
  colorMode: 'light',
  middleware: [
    function (_to, _from) {
      const isCartFeatureEnabled = useFeatureFlag('cart');
      if (!isCartFeatureEnabled) {
        navigateTo('/');
      }
    },
    'auth',
  ],
});
</script>

<template>
  <div>
    <div class="text-center mb-4 relative">
      <template v-if="status === 'pending'">
        {{ cartLabels?.cartLoading }}
      </template>
      <template v-else-if="cart">
        {{ cartLabels?.yourCart }} ({{ cart[0].length }} {{ cartLabels?.item.toLocaleLowerCase() + (cart.length > 1 ? 's' : '') }})
      </template>
      <template v-else>
        {{ cartLabels?.emptyCart }}
      </template>
      <div class="absolute p-1 top-0 right-0">
        <UButton
          v-if="JSON.stringify(rowSelection) !== JSON.stringify({})"
          icon="i-lucide-trash"
          color="error"
          @click="() => onClick()"
        >
          Delete selected items
        </UButton>
      </div>
    </div>
    <CartTable
      ref="cartTable"
      v-model:row-selection="rowSelection"
      :cart="cart[0]"
      :loading="status !== 'success'"
    />
    <UAccordion
      v-if="cart[1].length > 0"
      :items="[{
        label: `${cart[1].length} ${cartLabels?.itemUnavailable}`,
      }]"
      class="px-4"
    >
      <template #content>
        <CartTable
          ref="unavailableTable"
          v-model:row-selection="rowSelection"
          :cart="cart[1]"
          :loading="status !== 'success'"
        />
      </template>
    </UAccordion>
  </div>
</template>

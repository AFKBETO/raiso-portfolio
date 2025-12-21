<script setup lang="ts">
import type { CartCollectionItem } from '@nuxt/content';
import type { FormSubmitEvent } from '@nuxt/ui';
import z from 'zod';
import type { OrderInfoInt, ClientCartItemInt } from '~/database/BuyerModel';
import type { SelectedRow } from '~/types/cart';

const addressSchema = z.object({
  address1: z.string().min(1, 'Required'),
  address2: z.string(),
  city: z.string().min(1, 'Required'),
  postalCode: z.string().regex(/^\d{3,6}$/, 'Invalid postal code'),
  country: z.string().min(1, 'Required'),
  phoneNumber: z.string().regex(/^\+?(\d{1,3})?[-.\s]?(\(?\d{3}\)?[-.\s]?)?(\d[-.\s]?){6,9}\d$/, 'Invalid phone number'),
  instruction: z.string(),
});

const { status, data: cart } = await useCartInfo();

if (!cart.value[0].length && !cart.value[1].length) {
  navigateTo('/shop');
}

const defaultAddressState = {
  address1: '',
  address2: '',
  city: '',
  postalCode: '',
  country: '',
  phoneNumber: '',
  instruction: '',
} as const;

const addressState = reactive<OrderInfoInt>({ ...defaultAddressState });

function resetForm() {
  Object.assign(addressState, defaultAddressState);
}

const cartCookie = useCart();

const { data: cartLabels } = useNuxtData<CartCollectionItem>('/cart');

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

const toast = useToast();
const requestFetch = useRequestFetch();

async function onSubmit(event: FormSubmitEvent<OrderInfoInt>) {
  const cart: ClientCartItemInt[] = [];
  for (const key in cartCookie.value) {
    if (cartCookie.value[key]) cart.push(cartCookie.value[key]);
  }
  const result = await requestFetch('/api/carts', {
    method: 'POST',
    body: {
      orderInfo: event.data,
      cart: cart,
    },
  });
  if (result) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
    cartCookie.value = {};
    navigateTo('/carts');
  }
}

definePageMeta({
  colorMode: 'light',
  middleware: [
    function (_to, _from) {
      const isCartFeatureEnabled = useFeatureFlag('cart');
      if (!isCartFeatureEnabled) {
        navigateTo('/');
      }
      resetForm();
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
    <UForm
      :state="addressState"
      :schema="addressSchema"
      class="m-auto w-1/2 mt-8"
      @submit="onSubmit"
    >
      <UFormField
        :label="cartLabels?.address1"
        name="address1"
      >
        <UInput
          v-model="addressState.address1"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="cartLabels?.address2"
        name="address2"
      >
        <UInput
          v-model="addressState.address2"
          class="w-full"
        />
      </UFormField>
      <div class="grid grid-cols-3 gap-2 w-full">
        <UFormField
          :label="cartLabels?.city"
          name="city"
        >
          <UInput
            v-model="addressState.city"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="cartLabels?.postalCode"
          name="postalCode"
        >
          <UInput
            v-model="addressState.postalCode"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="cartLabels?.country"
          name="country"
        >
          <UInput
            v-model="addressState.country"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="cartLabels?.phoneNumber"
          name="phoneNumber"
        >
          <UInput
            v-model="addressState.phoneNumber"
            class="w-full"
          />
        </UFormField>
      </div>
      <UFormField
        :label="cartLabels?.instruction"
        name="instruction"
      >
        <UTextarea
          v-model="addressState.instruction"
          :rows="5"
          class="w-full"
        />
      </UFormField>
      <UButton
        type="submit"
        class="mt-3"
      >
        {{ cartLabels?.payment }}
      </UButton>
    </UForm>
  </div>
</template>

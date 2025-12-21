<script setup lang="ts">
import type { CartCollectionItem } from '@nuxt/content';
import type { OrderDetailsInt, OrderStatus } from '~/database/BuyerModel';

const { status, data: carts } = await useFetch<OrderDetailsInt[]>(`/api/carts`, {
  key: 'user-carts',
  lazy: true,
  server: false,
  default: () => [],
});

const auth = useAuth();

definePageMeta({
  colorMode: 'light',
  middleware: [
    function (_to, _from) {
      const isCartFeatureEnabled = useFeatureFlag('user');
      if (!isCartFeatureEnabled) {
        navigateTo('/');
      }
      refreshNuxtData();
    },
    'auth',
  ],
});

type OrderStatusContent = {
  [status in OrderStatus]: {
    locale: string;
    color: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral';
  };
};
const { data: cartLabels } = useNuxtData<CartCollectionItem>('/cart');

const orderStatusContent = computed(() => ({
  pending: {
    locale: cartLabels.value?.pending,
    color: 'info',
  },
  shipping: {
    locale: cartLabels.value?.shipping,
    color: 'warning',
  },
  delivered: {
    locale: cartLabels.value?.delivered,
    color: 'success',
  },
  cancelled: {
    locale: cartLabels.value?.cancelled,
    color: 'error',
  },
} as OrderStatusContent));

function logout() {
  auth.value = null;
  reloadNuxtApp();
}
</script>

<template>
  <div v-if="status === 'pending'">
    {{ cartLabels?.loading }}
  </div>
  <div v-else-if="status === 'error'">
    {{ cartLabels?.error }}
  </div>
  <div v-else>
    <div class="flex flex-cols justify-between mx-4">
      <span class="text-xl">
        {{ cartLabels?.yourOrders }}
      </span>
      <UButton
        color="error"
        variant="solid"
        icon="i-lucide-log-out"
        @click="logout"
      >
        {{ cartLabels?.logout }}
      </UButton>
    </div>

    <UAccordion
      class="mx-3"
      :items="carts"
      :collapsible="false"
      default-value="0"
    >
      <template #leading="{ item }">
        <div class="grid grid-cols-4 w-full mx-3">
          <span class="text-left">
            <strong>{{ cartLabels?.orderDate }}</strong> {{ (new Date(item.timestamp)).toLocaleDateString() }}
          </span>
          <span class="text-left">
            <strong>Status</strong> <UBadge
              variant="solid"
              :color="orderStatusContent[item.status].color"
            >{{ orderStatusContent[item.status].locale }}</UBadge>
          </span>
          <span class="text-left">
            <strong>{{ cartLabels?.shippingTo }}</strong> <UPopover mode="hover">
              <span>
                {{ item.orderInfo.city }} <UIcon name="i-lucide-chevron-down" />
              </span>
              <template #content>
                <div class="flex flex-col gap-1 p-1">
                  <span>
                    {{ item.orderInfo.address1 }}
                  </span>
                  <span>
                    {{ item.orderInfo.address2 }}
                  </span>
                  <span>
                    {{ item.orderInfo.postalCode }} {{ item.orderInfo.city }}
                  </span>
                  <span>
                    {{ item.orderInfo.country }}
                  </span>
                  <span>
                    <strong>{{ cartLabels?.instruction }}</strong>: {{ item.orderInfo.instruction }}
                  </span>
                </div>
              </template>
            </UPopover>
          </span>
          <span class="text-right">
            <strong>{{ cartLabels?.total }}</strong> {{ parsePrice(item.cart.reduce((acc, cur) => acc + cur.amount, 0)) }}
          </span>
        </div>
      </template>
      <template #body="{ item }">
        <OrderDetailTable
          class="mx-3"
          :cart="item.cart"
          :loading="status !== 'success'"
        />
      </template>
    </UAccordion>
  </div>
</template>

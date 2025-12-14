<script setup lang="ts">
import type { HeaderCollectionItem } from '@nuxt/content';
import type { PieceLocaleInt } from '~/database/WorkModel';

const cartCookie = useCart();
const isCartFeatureEnabled = useFeatureFlag('cart');

const open = ref(false);

const { data: headerLabels } = useNuxtData<HeaderCollectionItem>('/header');

interface CartInfoInt {
  _id: string;
  title: string;
  productTitle?: string;
  price: number;
  imageUrl: string;
  workId: string;
  minQuantity: number;
  maxQuantity: number;
  quantity: number;
}

const { data: cart } = await useAsyncData<CartInfoInt[]>('cart-items', async () => {
  const result: CartInfoInt[] = [];
  for (const key in cartCookie.value) {
    const cartItem = cartCookie.value[key];
    if (!cartItem || cartItem.quantity === 0) {
      continue;
    }
    const product = await $fetch<PieceLocaleInt>(`/api/works/${cartItem.workId}/pieces/${cartItem.pieceId}`);
    if (!!product && !!product.productInfo) {
      result.push({
        _id: product._id,
        workId: product.workId,
        title: product.title,
        productTitle: product.productInfo.productTitle,
        price: product.productInfo.price,
        imageUrl: product.imageUrls[product.primaryImageIndex],
        minQuantity: product.productInfo.minQuantity,
        maxQuantity: product.productInfo.maxQuantity,
        quantity: cartItem.quantity,
      });
    }
  }
  return result;
}, { server: false, watch: [cartCookie] });

const cartLength = computed(() => cart.value ? cart.value.length : 0);
const sum = computed(() => cart.value ? cart.value.reduce((acc, cur) => acc + cur.price * cartCookie.value[cur.workId + '-' + cur._id]!.quantity, 0) : 0);

function parseTitle(product: CartInfoInt): string {
  if (!product.productTitle) {
    return product.title;
  }
  return `${product.title} | ${product.productTitle}`;
}

function onClick(productId: string) {
  cartCookie.value = { ...cartCookie.value, [productId]: undefined };
}
</script>

<template>
  <USlideover
    v-model:open="open"
    class="my-auto"
    :title="headerLabels?.cart"
    :overlay="false"
  >
    <UChip
      :text="cartLength"
      size="3xl"
      :show="!!cart && !!cart.length"
    >
      <UButton
        size="xl"
        icon="i-lucide-shopping-cart"
        color="neutral"
        variant="outline"
        :label="parsePrice(sum)"
      />
    </UChip>
    <template #body>
      <div
        v-if="cartLength > 0"
      >
        <template
          v-for="cartItem in cart"
          :key="cartItem.workId + '-' + cartItem._id"
        >
          <UCard variant="outline">
            <div class="flex gap-2 items-center">
              <img
                width="50%"
                :alt="cartItem.productTitle"
                :src="parseImageSrc(cartItem.imageUrl, 150)"
              >
              <div class="flex flex-col gap-3 justify-between">
                <div class="flex justify-end">
                  <UButton
                    icon="i-lucide-trash"
                    color="error"
                    @click="() => onClick(cartItem.workId + '-' + cartItem._id)"
                  />
                </div>
                <ULink
                  class="font-semibold"
                  :to="`/works/${cartItem.workId}/pieces/${cartItem._id}`"
                  raw
                  @click="() => { open = false }"
                >
                  {{ parseTitle(cartItem) }}
                </ULink>
                <div class="flex justify-between items-center gap-2">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ parsePrice(cartItem.price) }}
                  </p>
                  <UInputNumber
                    v-model="cartCookie[cartItem.workId + '-' + cartItem._id]!.quantity"
                    orientation="vertical"
                    class="w-16"
                    :min="cartItem.minQuantity ?? 0"
                    :max="cartItem.maxQuantity > 0 ? cartItem.maxQuantity : undefined"
                  />
                </div>
                <p class="font-semibold text-end">
                  {{ parsePrice(cartCookie[cartItem.workId + '-' + cartItem._id]!.quantity * cartItem.price) }}€
                </p>
              </div>
            </div>
          </UCard>
        </template>
      </div>
      <div v-else>
        {{ headerLabels?.emptyCart }}
        <UButton
          size="xl"
          icon="i-lucide-store"
          color="primary"
          variant="solid"
          to="/shop"
          @click="() => { open = false }"
        />
      </div>
    </template>
    <template #footer>
      <UButton
        :label="headerLabels?.close"
        color="error"
        variant="outline"
        @click="() => { open = false }"
      />
      <UButton
        v-if="cartLength > 0 && isCartFeatureEnabled"
        color="neutral"
        to="/cart"
        @click="() => { open = false }"
      >
        <div class="flex gap-2">
          <p class="font-semibold">
            {{ headerLabels?.payment }}:
          </p>
          <p>
            {{ parsePrice(sum) }}
          </p>
        </div>
      </UButton>
    </template>
  </USlideover>
</template>

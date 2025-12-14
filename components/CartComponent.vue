<script setup lang="ts">
import type { HeaderCollectionItem } from '@nuxt/content';

const cartCookie = useCart();
const isCartFeatureEnabled = useFeatureFlag('cart');

const open = ref(false);

const { data: headerLabels } = useNuxtData<HeaderCollectionItem>('/header');

const { data: cart } = await useCartInfo();

const cartLength = computed(() => cart.value ? cart.value[0].length : 0);
const sum = computed(() => cart.value ? cart.value[0].reduce((acc, cur) => acc + cur.amount, 0) : 0);

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
      :show="!!cart[0] && !!cart[0].length"
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
        class="grid grid-cols-1 gap-2 mt-2"
      >
        <template
          v-for="cartItem in cart[0]"
          :key="cartItem.workId + '-' + cartItem._id"
        >
          <UCard variant="outline">
            <div class="flex gap-2 items-center">
              <img
                width="50%"
                :alt="cartItem.productTitle"
                :src="parseImageSrc(cartItem.imageUrl, 100)"
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
                    size="xs"
                    class="w-20"
                    :min="cartItem.minQuantity ?? 0"
                    :max="cartItem.maxQuantity > 0 ? cartItem.maxQuantity : undefined"
                  />
                </div>
                <p class="font-semibold text-end">
                  {{ parsePrice(cartItem.amount) }}
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

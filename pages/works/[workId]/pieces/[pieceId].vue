<script setup lang="ts">
import PieceComponent from '~/components/PieceComponent.vue';
import type { PieceLocaleInt } from '~/database/WorkModel';
const locale = 'fr';
const route = useRoute();
const { workId, pieceId } = route.params;

const { data } = await useFetch<PieceLocaleInt> (`/api/works/${workId}/pieces/${pieceId}?locale=${locale}`);

definePageMeta({
	colorMode: 'light',
})
</script>

<template>
	<div class="w-full m-auto p-10 flex">
    <template v-if="data === null">
      Item not found
    </template>
    <template v-else>
      <PieceComponent :piece="data" />
    </template>
	</div>
</template>
<script setup lang="ts">
import type { Page } from '~/types/page';
import type { Work } from '~/types/work';

const { data } = await useFetch<Page<Work>> ('/api/works');

const workMapByYear = new Map<number, Work[]>();
const works = data?.value?.results || [];
const activeValue: string[] = [];
for (const work of works) {
  const year = new Date(work.date).getFullYear();
  if (!workMapByYear.has(year)) {
    workMapByYear.set(year, []);
  }
  workMapByYear.get(year)?.push(work);
}

const items = Array.from(workMapByYear.keys().map((year) => {
  activeValue.push(activeValue.length.toString());
  return {
    label: year.toString(),
  };
}));
</script>

<template>
  <UAccordion
    type="multiple"
    :items="items"
    :defaultValue="activeValue"
  >
    <template #content="{ item }">
      <ULink 
        v-for="work in workMapByYear.get(Number(item.label))"
        :key="work.id"
        :href="`/works/${work.id}`"
        class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {{ work.title }}
      </ULink>
    </template>
  </UAccordion>
</template>
<script setup lang="ts">
import type { WorkInt } from '~/database/WorkModel';
import type { Page } from '~/types/page';

const { data } = await useFetch<Page<WorkInt>> ('/api/works');

const workMapByYear = new Map<number, WorkInt[]>();
const works = data?.value?.results || [];
const activeValue: string[] = [];
for (const work of works) {
  const year = work.year;
  if (!workMapByYear.has(year)) {
    workMapByYear.set(year, []);
  }
  if (work.title === 'N/A') {
    work.title = work.pieces[0].title;
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
        :key="work._id"
        :href="`/works/${work._id}`"
        class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {{ work.title }}
      </ULink>
    </template>
  </UAccordion>
</template>
<script setup lang="ts">
import type { WorkTimelineInt, WorkTitleInt } from '~/database/WorkModel';

const isLargeScreen = useLargeScreen();

const { data } = await useFetch<WorkTimelineInt[]> ('/api/works', {
  key: 'works-timeline',
});
const years = data.value || [];

const workMapByYear = new Map<number, WorkTitleInt[]>();
for (const year of years) {
  workMapByYear.set(year.year, year.works);
}
const activeValue: string[] = [];

const items = Array.from(workMapByYear.keys().map((year) => {
  activeValue.push(activeValue.length.toString());
  return {
    label: year.toString(),
  };
}));
</script>

<template>
  <div>
    <div
      v-show="!isLargeScreen"
      class="text-lg text-bold"
    >
      My artworks
    </div>
    <UAccordion
      type="multiple"
      :items="items"
      :default-value="activeValue"
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
  </div>
</template>

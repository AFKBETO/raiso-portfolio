<template>
  <div class="w-full m-auto py-4 px-10 flex flex-col-reverse md:flex-row gap-10">
    <WorkTimeline class="basis-2xs" />
    <div class="flex flex-col gap-4">
      <ContentRenderer
        v-if="data"
        class="prose !max-w-none"
        :value="data"
      />
      <PortfolioShowcase />
    </div>
  </div>
</template>

<script setup lang="ts">
import PortfolioShowcase from '~/components/PortfolioShowcase.vue';

const locale = useNuxtLocale();

const seoTitle = 'BUITHUHUONG - Portfolio de Bui Thu Huong';

const { data: seo } = await useAsyncData('seo', async () => {
  const seo = await queryCollection('seo')
    .where('language', '=', locale.value)
    .first();
  if (seo) {
    return seo;
  }
  return queryCollection('seo')
    .where('language', '=', 'fr')
    .first();
}, {
  watch: [locale],
});

const { data } = await useAsyncData('/home', async () => {
  const content = await queryCollection('content')
    .path('/home/' + locale.value)
    .first();
  if (content) {
    return content;
  }
  return queryCollection('content')
    .path('/home/fr')
    .first();
}, {
  lazy: true,
  watch: [locale],
});

definePageMeta({
  colorMode: 'light',
});

useSeoMeta({
  title: seoTitle,
  description: seo.value?.description,
  ogTitle: seoTitle,
  ogDescription: seo.value?.description,
  ogImage: '/favicon.png',
  ogUrl: 'https://buithuhuong.work',
  twitterTitle: seoTitle,
  twitterDescription: seo.value?.description,
  twitterImage: '/favicon.png',
  twitterCard: 'summary',
});

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
  ],
});
</script>

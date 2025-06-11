<script setup lang="ts">
const route = useRoute();
const locale = useNuxtLocale();

definePageMeta({
  colorMode: 'dark',
});

const { data } = await useAsyncData(route.path, async () => {
  const content = await queryCollection('content')
    .path(route.path + '/' + locale.value)
    .first();
  if (content) {
    return content;
  }
  return queryCollection('content')
    .path(route.path + '/fr')
    .first();
}, {
  watch: [locale],
});

useSeoMeta({
  title: data.value?.title,
  description: data.value?.description,
  ogTitle: data.value?.title,
  ogDescription: data.value?.description,
  ogImage: '/favicon.png',
  ogUrl: `https://buithuhuong.work${route.path}`,
  twitterTitle: data.value?.title,
  twitterDescription: data.value?.description,
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

<template>
  <div class="w-full m-auto prose py-4 px-10 !max-w-none !text-white">
    <ContentRenderer
      v-if="data"
      :value="data"
    />
    <div v-else>
      {{ route.params.slug }} not found
    </div>
  </div>
</template>

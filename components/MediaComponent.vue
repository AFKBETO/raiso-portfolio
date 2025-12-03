<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue';

interface MediaComponentProps extends /* @vue-ignore */ ImgHTMLAttributes {
  src: string;
  mediaWidth: number;
}

const props = defineProps<MediaComponentProps>();

const isYouTubeMedia = isYouTubeURL(props.src as string);
console.log(isYouTubeMedia);
</script>

<template>
  <img
    v-if="!isYouTubeMedia"
    v-bind="props"
    :src="parseImageSrc(props.src, props.mediaWidth)"
  >
  <iframe
    v-else
    width="100%"
    :height="(props.mediaWidth ? (props.mediaWidth as number) * 0.56 : 315)"
    :src="parseYouTubeEmbed(props.src)"
    :title="props.alt"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
</template>

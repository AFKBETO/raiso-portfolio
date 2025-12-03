export default function parseImageSrc(src: string, width?: number): string {
  try {
    const url = new URL(src);
    if (isYouTubeURL(src)) {
      const id = fetchYouTubeId(src);
      if (id) {
        return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      }
      return src;
    }
    const resize = width ? `?width=${width}` : '';
    return `${url}${resize}`;
  }
  catch {
    const { cdnUrl } = useRuntimeConfig().public;
    const resize = width ? `/c_scale,w_${width}` : '';
    return `${cdnUrl}${resize}/${src}`;
  }
}

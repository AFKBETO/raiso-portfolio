export default function parseImageSrc(src: string, width?: number): string {
  try {
    const url = new URL(src);
    const resize = width ? `?width=${width}` : '';
    return `${url}${resize}`;
  }
  catch {
    const { cdnUrl } = useRuntimeConfig().public;
    const resize = width ? `/c_scale,w_${width}` : '';
    return `${cdnUrl}${resize}/${src}`;
  }
}

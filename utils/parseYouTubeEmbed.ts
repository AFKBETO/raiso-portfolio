export default function parseYouTubeEmbed(url: string): string {
  const id = fetchYouTubeId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

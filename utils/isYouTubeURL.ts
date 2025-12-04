export default function isYouTubeURL(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return (
      (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com')
      && parsedUrl.searchParams.has('v')
    ) || (
      parsedUrl.hostname === 'youtu.be'
      && parsedUrl.pathname.length > 1
    );
  }
  catch {
    return false;
  }
}

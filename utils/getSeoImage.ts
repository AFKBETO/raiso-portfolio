import type { WorkLocaleInt, PieceLocaleInt } from '~/database/WorkModel';

export default function getSeoImage(data: WorkLocaleInt | PieceLocaleInt | null) {
  if (isPiece(data)) {
    return parseImageSrc(data.imageUrl, 300);
  }
  if (data?.pieces[0]?.imageUrl) {
    return parseImageSrc(data.pieces[0].imageUrl, 300);
  }
  return '/favicon.png';
}

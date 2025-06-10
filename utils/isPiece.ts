import type { PieceLocaleInt } from '~/database/WorkModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isPiece(item: any): item is PieceLocaleInt {
  return (item as PieceLocaleInt).imageUrl !== undefined;
}

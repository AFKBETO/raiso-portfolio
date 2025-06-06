import type { PieceLocaleInt } from "~/database/WorkModel";

export default function isPiece(item: any): item is PieceLocaleInt {
  return (item as PieceLocaleInt).imageUrl !== undefined;
}
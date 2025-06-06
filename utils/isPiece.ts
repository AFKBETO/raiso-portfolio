import type { PieceInt } from "~/database/WorkModel";

export default function isPiece(item: any): item is PieceInt {
  return (item as PieceInt).imageUrl !== undefined;
}
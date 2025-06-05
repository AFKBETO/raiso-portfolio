import { model, Schema, type Document } from "mongoose";
import type { Locale } from "~/types/locale";

export interface PieceInt extends Document {
  _id: string;
  title: string;
  year: number;
  dimension: string;
  material: {
    [k in Locale]: string;
  };
  imageUrl: string;
  description: {
    [k in Locale]: string;
  };
}

export interface WorkInt extends Document {
  _id: string;
  title: string;
  year: number;
  pieces: PieceInt[];
}


export const PieceSchema = new Schema<PieceInt>({
  _id: Schema.Types.ObjectId,
  title: String,
  year: Number,
  dimension: String,
  material: {
    type: Map,
    of: String
  },
  imageUrl: String,
  description: {
    type: Map,
    of: String,
  }
});

export const WorkSchema = new Schema<WorkInt>({
    _id: Schema.Types.ObjectId,
    title: String,
    year: Number,
    pieces: [PieceSchema]
})

export const WorkModel = model('Work', WorkSchema, 'works');
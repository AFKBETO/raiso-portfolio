import { model, Schema, type Document } from 'mongoose';
import type { Locale } from '~/types/locale';

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
  tags: string[];
}

export interface WorkInt extends Document {
  _id: string;
  title: string;
  year: number;
  showcase: boolean;
  pieces: PieceInt[];
}

export const PieceSchema = new Schema<PieceInt>({
  _id: Schema.Types.ObjectId,
  title: String,
  year: Number,
  dimension: String,
  material: {
    type: Map,
    of: String,
  },
  imageUrl: String,
  description: {
    type: Map,
    of: String,
  },
  tags: [String],
});

export const WorkSchema = new Schema<WorkInt>({
  _id: Schema.Types.ObjectId,
  title: String,
  year: Number,
  showcase: Boolean,
  pieces: [PieceSchema],
});

export interface WorkTitleInt extends Document {
  _id: string;
  title: string;
}

export interface WorkTimelineInt {
  year: number;
  works: WorkTitleInt[];
}

export interface PieceLocaleInt extends Document {
  _id: string;
  locale: Locale;
  title: string;
  year: number;
  dimension: string;
  material: string;
  imageUrl: string;
  description: string;
  tags: string[];
  workId?: string;
  workTitle?: string;
}

export interface PieceSimplifiedInt extends Document {
  _id: string;
  title: string;
  imageUrl: string;
}

export interface PieceWithWorkIdInt extends Document {
  _id: string;
  title: string;
  year: number;
  imageUrl: string;
  tags: string[];
  workId?: string;
}

export interface WorkLocaleInt extends Document {
  _id: string;
  title: string;
  year: number;
  pieces: PieceSimplifiedInt[];
}

export interface WorkImgInt extends Document {
  _id: string;
  title: string;
  imageUrl: string;
}

export const WorkModel = model('Work', WorkSchema, 'works');

import { model, Schema } from 'mongoose';
import type { Locale } from '~/types/locale';

export interface CategoryInt {
  _id: string;
  name: string;
  nameLocale: {
    [k in Locale]: string;
  };
  description: {
    [k in Locale]: string;
  };
}

export interface ProductInfoInt {
  isSoldout: boolean;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  categories: string[];
  productTitle: string;
}

export interface PieceInt {
  _id: string;
  title: string;
  year: number;
  dimension: string;
  imageUrl?: string;
  material: {
    [k in Locale]: string;
  };
  imageUrls: string[];
  primaryImageIndex: number;
  description: {
    [k in Locale]: string;
  };
  tags: string[];
  isShow: boolean;
  productInfo?: ProductInfoInt;
  priority: number;
}

export interface WorkInt {
  _id: string;
  title: string;
  year: number;
  showcase?: boolean;
  isPureProduct: boolean;
  description: {
    [k in Locale]: string;
  };
  pieces: PieceInt[];
}

export const CategorySchema = new Schema<CategoryInt>({
  _id: Schema.Types.ObjectId,
  name: String,
  nameLocale: {
    type: Map,
    of: String,
  },
  description: {
    type: Map,
    of: String,
  },
});

export const ProductInfoSchema = new Schema<ProductInfoInt>({
  isSoldout: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  categories: [String],
  productTitle: String,
  minQuantity: Number,
  maxQuantity: Number,
}, { _id: false });

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
  imageUrls: {
    type: [String],
    required: false,
  },
  primaryImageIndex: {
    type: Number,
    default: 0,
  },
  description: {
    type: Map,
    of: String,
  },
  tags: [String],
  isShow: {
    type: Boolean,
    default: false,
  },
  productInfo: ProductInfoSchema,
  priority: Number,
});

export const WorkSchema = new Schema<WorkInt>({
  _id: Schema.Types.ObjectId,
  title: String,
  year: Number,
  showcase: Boolean,
  isPureProduct: Boolean,
  description: {
    type: Map,
    of: String,
  },
  pieces: [PieceSchema],
});

export interface WorkTitleInt {
  _id: string;
  title: string;
}

export interface WorkTimelineInt {
  year: number;
  works: WorkTitleInt[];
}

export interface PieceLocaleInt {
  _id: string;
  locale: Locale;
  title: string;
  year: number;
  dimension: string;
  material: string;
  imageUrls: string[];
  primaryImageIndex: number;
  description: string;
  tags: string[];
  isShow: boolean;
  productInfo?: ProductInfoInt;
  workId: string;
  workTitle?: string;
}

export interface PieceSimplifiedInt {
  _id: string;
  title: string;
  imageUrl: string;
}

export interface PieceWithWorkIdInt {
  _id: string;
  title: string;
  year: number;
  imageUrl: string;
  tags: string[];
  isShow: boolean;
  workId?: string;
  priority: number;
}

export interface WorkLocaleInt {
  _id: string;
  title: string;
  year: number;
  description: string;
  pieces: PieceSimplifiedInt[];
}

export interface WorkImgInt {
  _id: string;
  title: string;
  imageUrl: string;
}

export interface ProductCardInt {
  _id: string;
  title: string;
  productTitle?: string;
  price: number;
  imageUrl: string;
  isSoldout: boolean;
  workId?: string;
}

export const CategoryModel = model<CategoryInt>('Category', CategorySchema, 'categories');
export const WorkModel = model<WorkInt>('Work', WorkSchema, 'works');

import { type Types, model, Schema, type Model, type Document } from 'mongoose';

export interface CartItemInt {
  workId?: string;
  pieceId?: string;
  sellPrice?: number;
  quantity: number;
}

export type CartItemModelType = Model<CartItemInt>;

export interface OrderInt extends Document {
  _id: string;
  timestamp: number;
  cart: CartItemInt[];
}

export interface OrderWithUserIdInt {
  _id: string;
  userId: string;
  timestamp: number;
  cart: CartItemInt[];
}

type THydratedOrderDocument = {
  _id: string;
  userId: string;
  timestamp: number;
  cart: Types.DocumentArray<CartItemInt>;
};
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type OrderModelType = Model<OrderInt, {}, {}, {}, THydratedOrderDocument>;

export interface BuyerInt extends Document {
  email: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  orders: OrderInt[];
  secretCode?: string;
  lastSessionAt?: number;
}

type THydratedBuyerDocument = Document & {
  _id: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  orders: Types.DocumentArray<OrderInt>;
  secretCode?: string;
  lastSessionAt?: number;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type BuyerModelType = Model<BuyerInt, {}, {}, {}, THydratedBuyerDocument>;

export const CartItemSchema = new Schema<CartItemInt, CartItemModelType>({
  workId: Schema.Types.ObjectId,
  pieceId: Schema.Types.ObjectId,
  sellPrice: Number,
  quantity: Number,
}, {
  _id: false,
});

CartItemSchema.index({ productId: 1 });
export const OrderSchema = new Schema<OrderInt, OrderModelType>({
  timestamp: { type: Number, default: Date.now() },
  cart: [CartItemSchema],
});

export const BuyerSchema = new Schema<BuyerInt, BuyerModelType>({
  email: { type: String, required: true, unique: true },
  address1: String,
  address2: { type: String, required: false },
  city: String,
  postalCode: String,
  country: String,
  phoneNumber: String,
  orders: [OrderSchema],
  secretCode: String,
  lastSessionAt: Number,
});

export const BuyerModel = model<BuyerInt, BuyerModelType>('Buyer', BuyerSchema, 'buyers');

export interface ClientCartItemInt {
  workId: string;
  pieceId: string;
  quantity: number;
}

export interface ClientOrderInt {
  [k: string]: ClientCartItemInt | undefined;
}

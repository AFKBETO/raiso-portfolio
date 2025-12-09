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
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type BuyerModelType = Model<BuyerInt, {}, {}, {}, THydratedBuyerDocument>;

const CartItemSchema = new Schema<CartItemInt, CartItemModelType>({
  workId: { type: Schema.Types.ObjectId, index: true },
  pieceId: { type: Schema.Types.ObjectId, index: true },
  sellPrice: Number,
  quantity: Number,
}, {
  _id: false,
});
export const OrderSchema = new Schema<OrderInt, OrderModelType>({
  timestamp: { type: Number, default: Date.now() },
  cart: [CartItemSchema],
});

const BuyerSchema = new Schema<BuyerInt, BuyerModelType>({
  email: { type: String, required: true, unique: true, index: true },
  address1: { type: String, default: '' },
  address2: { type: String, required: false },
  city: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  country: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  orders: [OrderSchema],
  secretCode: { type: String, default: '' },
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

import { type Types, model, Schema, type Model, type Document } from 'mongoose';

export interface CartItemInt {
  workId: string;
  pieceId: string;
  sellPrice: number;
  quantity: number;
}
export type CartItemModelType = Model<CartItemInt>;

export interface OrderInfoInt {
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  instruction: string;
}

const orderStatus = ['pending', 'shipping', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof orderStatus[number];

export interface OrderInt extends Document {
  orderInfo: OrderInfoInt;
  timestamp: number;
  status: OrderStatus;
  cart: CartItemInt[];
}
type THydratedOrderDocument = {
  orderInfo: OrderInfoInt;
  timestamp: number;
  status: OrderStatus;
  cart: Types.DocumentArray<CartItemInt>;
};

interface OrderVirtuals {
  amount: number;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type OrderModelType = Model<OrderInt, {}, {}, OrderVirtuals, THydratedOrderDocument>;

export interface BuyerInt extends Document {
  email: string;
  orders: OrderInt[];
  secretCode?: string;
}

type THydratedBuyerDocument = Document & {
  email: string;
  orders: Types.DocumentArray<OrderInt>;
  secretCode?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type BuyerModelType = Model<BuyerInt, {}, {}, {}, THydratedBuyerDocument>;

const CartItemSchema = new Schema<CartItemInt, CartItemModelType>({
  workId: { type: String, index: true },
  pieceId: { type: String, index: true },
  sellPrice: Number,
  quantity: Number,
}, {
  _id: false,
});

const OrderInfoSchema = new Schema<OrderInfoInt>({
  address1: String,
  address2: String,
  city: String,
  postalCode: String,
  country: String,
  phoneNumber: String,
  instruction: String,
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const OrderSchema = new Schema<OrderInt, OrderModelType, {}, {}, OrderVirtuals>({
  timestamp: { type: Number, default: Date.now() },
  orderInfo: OrderInfoSchema,
  status: { type: String, enum: orderStatus, default: 'pending' },
  cart: [CartItemSchema],
});
OrderSchema.virtual('amount').get(function () {
  return this.cart.reduce((acc, cur) => acc + cur.quantity * (cur.sellPrice ?? 0), 0);
});

const BuyerSchema = new Schema<BuyerInt, BuyerModelType>({
  email: { type: String, required: true, unique: true, index: true },
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
  [productId: string]: ClientCartItemInt | undefined;
}

export interface CartInfoInt {
  _id: string;
  title: string;
  productTitle?: string;
  sellPrice: number;
  imageUrl: string;
  workId: string;
  minQuantity: number;
  maxQuantity: number;
  quantity: number;
  amount: number;
  isSoldout: boolean;
}

export interface CartInt {
  orderInfo: OrderInfoInt;
  cart: ClientCartItemInt[];
}

export interface CartIdInt {
  cartId: string;
}

export interface CartItemDetailsInt {
  _id: string;
  title: string;
  productTitle?: string;
  sellPrice: number;
  imageUrl: string;
  workId: string;
  quantity: number;
  amount: number;
}

export interface OrderDetailsInt {
  orderInfo: OrderInfoInt;
  timestamp: number;
  status: OrderStatus;
  cart: CartItemDetailsInt[];
}

export { OrderSchema };

import { Types } from 'mongoose';
import { BuyerModel, type CartItemDetailsInt, type CartIdInt, type CartInt, type CartItemInt, type OrderDetailsInt } from './BuyerModel';
import { WorkModel } from './WorkModel';

async function fetchPrice(workId: string, pieceId: string): Promise<number> {
  const result = await WorkModel.aggregate<{ price: number }>([
    {
      $match: {
        _id: new Types.ObjectId(workId),
      },
    }, {
      $replaceWith: {
        $arrayElemAt: [
          {
            $filter: {
              input: '$pieces',
              as: 'piece',
              cond: { $eq: ['$$piece._id', new Types.ObjectId(pieceId)] },
            },
          },
          0,
        ],
      },
    }, {
      $project: {
        price: '$productInfo.price',
      },
    },
  ]);
  return result[0].price ?? 0;
}
export async function createCartForUser(userEmail: string, cartInfo: CartInt): Promise<CartIdInt> {
  const user = await BuyerModel.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }
  const cart: CartItemInt[] = [];
  for (const cartItem of cartInfo.cart) {
    const price = await fetchPrice(cartItem.workId, cartItem.pieceId);
    cart.push({ ...cartItem, sellPrice: price });
  }
  const length = user.orders.push({
    orderInfo: cartInfo.orderInfo,
    cart: cart,
  });
  await user.save();
  const newOrder = user.orders[length - 1];

  const result = { cartId: newOrder._id.toString() };

  return result;
}

export async function getAllOrders(userEmail: string): Promise<OrderDetailsInt[]> {
  const user = await BuyerModel.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }
  const orders: OrderDetailsInt[] = [];
  for (const orderInfo of user.orders) {
    const cart: CartItemDetailsInt[] = await Promise.all(orderInfo.cart.map(async (cartItem) => {
      const work = await WorkModel.findById(cartItem.workId);
      const piece = work?.pieces.id(cartItem.pieceId);
      return {
        _id: cartItem.pieceId,
        workId: cartItem.workId,
        sellPrice: cartItem.sellPrice,
        quantity: cartItem.quantity,
        title: piece?.title ?? '',
        imageUrl: piece?.imageUrls[piece?.primaryImageIndex] ?? '',
        amount: cartItem.quantity * cartItem.sellPrice,
      };
    }));
    const order: OrderDetailsInt = {
      orderInfo: orderInfo.orderInfo,
      timestamp: orderInfo.timestamp,
      status: orderInfo.status,
      cart: cart,
    };
    orders.push(order);
  }
  return orders;
}

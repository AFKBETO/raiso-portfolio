import { defineContentConfig, defineCollection, z } from '@nuxt/content';

const contentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  language: z.string(),
  date: z.string().optional(),
});

const headerSchema = z.object({
  language: z.string(),
  home: z.string(),
  about: z.string(),
  activities: z.string(),
  shop: z.string(),
  cart: z.string(),
  emptyCart: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  sum: z.string(),
  total: z.string(),
  withoutVat: z.string(),
  withVat: z.string(),
  close: z.string(),
  payment: z.string(),
  itemUnavailable: z.string(),
  item: z.string(),
});

const footerSchema = z.object({
  language: z.string(),
  body: z.string(),
});

const seoSchema = z.object({
  language: z.string(),
  description: z.string(),
});

const pieceSchema = z.object({
  language: z.string(),
  work: z.string(),
  year: z.string(),
  materials: z.string(),
  dimension: z.string(),
  tags: z.string(),
  addToCart: z.string(),
});

const loginSchema = z.object({
  language: z.string(),
  login: z.string(),
  emailPlaceholder: z.string(),
  submit: z.string(),
  emailHelp: z.string(),
  code: z.string(),
  codeDescription: z.string(),
  codeCooldown: z.string(),
  second: z.string(),
});

const cartSchema = z.object({
  language: z.string(),
  yourCart: z.string(),
  item: z.string(),
  cartLoading: z.string(),
  emptyCart: z.string(),
  price: z.string(),
  quantity: z.string(),
  amount: z.string(),
  total: z.string(),
  withVat: z.string(),
  itemUnavailable: z.string(),
  selection: z.string(),
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phoneNumber: z.string(),
  instruction: z.string(),
  payment: z.string(),
  yourOrders: z.string(),
  orderDate: z.string(),
  status: z.string(),
  pending: z.string(),
  shipping: z.string(),
  delivered: z.string(),
  cancelled: z.string(),
  shippingTo: z.string(),
  loading: z.string(),
  error: z.string(),
  logout: z.string(),
});

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/**.md',
      schema: contentSchema,
    }),
    header: defineCollection({
      type: 'data',
      source: 'header/**.yml',
      schema: headerSchema,
    }),
    footer: defineCollection({
      type: 'data',
      source: 'footer/**.yml',
      schema: footerSchema,
    }),
    seo: defineCollection({
      type: 'data',
      source: 'seo/**.yml',
      schema: seoSchema,
    }),
    piece: defineCollection({
      type: 'data',
      source: 'piece/**.yml',
      schema: pieceSchema,
    }),
    login: defineCollection({
      type: 'data',
      source: 'login/**.yml',
      schema: loginSchema,
    }),
    cart: defineCollection({
      type: 'data',
      source: 'cart/**.yml',
      schema: cartSchema,
    }),
  },
});

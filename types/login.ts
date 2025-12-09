import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
});

export type LoginSchema = z.output<typeof loginSchema>;

export const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, { message: 'Must contain only 6 digits (0-9)' }),
});

export type CodeSchema = z.output<typeof codeSchema>;

export type LoginInfo = LoginSchema & CodeSchema;

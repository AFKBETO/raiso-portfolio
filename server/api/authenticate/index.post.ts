import { readFileSync } from 'node:fs';
import jwt from 'jsonwebtoken';
import { BuyerModel } from '~/database/BuyerModel';
import type { LoginInfo } from '~/types/login';

export default defineEventHandler(async (event): Promise<void> => {
  const loginInfo = await readBody<LoginInfo>(event);

  const config = useRuntimeConfig();

  const user = await BuyerModel.findOne({ email: loginInfo.email, secretCode: loginInfo.code }).exec();

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Login failed',
    });
  }

  const privateKey = readFileSync(config.privateKeyPath, 'utf8');

  const token = jwt.sign({ loginInfo }, privateKey);

  setCookie(event, 'auth', token, {
    maxAge: config.public.maxSessionAge,
    sameSite: true,
  });

  setResponseStatus(event, 204);
  return;
});

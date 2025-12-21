import { readFileSync } from 'node:fs';
import { importPKCS8, SignJWT } from 'jose';
import { BuyerModel } from '~/database/BuyerModel';
import type { LoginInfo } from '~/types/login';
import createLog from '~/utils/createLog';

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
  const privateKeyString = readFileSync(config.privateKeyPath, 'utf8');
  createLog(privateKeyString);

  const privateKey = await importPKCS8(privateKeyString, 'Ed25519');

  const token = await new SignJWT(loginInfo)
    .setProtectedHeader({ alg: 'EdDSA' })
    .setExpirationTime(config.public.maxSessionAge + 's')
    .sign(privateKey);

  setCookie(event, 'auth', token, {
    maxAge: config.public.maxSessionAge,
    sameSite: true,
  });

  setResponseStatus(event, 204);
  return;
});

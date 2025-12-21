import { readFileSync } from 'node:fs';
import { importSPKI, jwtVerify } from 'jose';
import type { LoginInfo } from '~/types/login';
import { BuyerModel } from '~/database/BuyerModel';
import createLog from '~/utils/createLog';

const authGuards = [
  '/api/carts',
];
export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event);

  if (authGuards.some(path => pathname.startsWith(path))) {
    const config = useRuntimeConfig();

    const token = getCookie(event, 'auth') || '';
    createLog(token);

    const publicKey = await importSPKI(readFileSync(config.publicKeyPath, 'utf8'), 'Ed25519');
    createLog(publicKey);
    try {
      const loginInfo = (await jwtVerify(token, publicKey)).payload as LoginInfo;
      const user = await BuyerModel.findOne({ email: loginInfo.email, secretCode: loginInfo.code }).exec();
      if (user) {
        event.context.email = loginInfo.email;
      }
      else {
        console.log('invalid logininfo');
      }
    }
    catch (error) {
      createLog(error);
      console.log('auth failure');
    }
  }
});

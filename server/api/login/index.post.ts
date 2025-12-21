import { randomInt } from 'crypto';
import { BuyerModel } from '~/database/BuyerModel';
import type { LoginSchema } from '~/types/login';
import createGmailTransporter from '~/utils/createGmailTransporter';
import createLog from '~/utils/createLog';

export default defineEventHandler(async (event): Promise<void> => {
  const loginInfo = await readBody<LoginSchema>(event);
  createLog(loginInfo.email);

  const user = await BuyerModel.findOneAndUpdate({ email: loginInfo.email }, {}, { new: true, upsert: true }).exec();

  if (!user) {
    // shouldn't happen here
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown error, cannot create new user',
    });
  }
  const newCode = randomInt(100000, 1000000);
  user.secretCode = String(newCode);
  createLog(newCode); // send mail with new code later
  await user.save();
  await createGmailTransporter({
    to: loginInfo.email,
    subject: 'Authentication Code',
    text: String(newCode),
  });
  setResponseStatus(event, 204);
  return;
});

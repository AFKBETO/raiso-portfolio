import type { MailInfo } from '~/types/mail';
import createGmailTransporter from '~/utils/createGmailTransporter';

export default defineEventHandler(async (event): Promise<string> => {
  const mailInfo = await readBody<MailInfo>(event);

  const result = await createGmailTransporter(mailInfo);

  console.log(result);

  return 'ok';
});

import { createTransport, type SentMessageInfo } from 'nodemailer';
import type { MailInfo } from '~/types/mail';

export default async function createGmailTransporter(mailInfo: MailInfo): Promise<SentMessageInfo> {
  const {
    googleEmail,
    googleAppPass,
    googleAlias,
  } = useRuntimeConfig();

  const { to, subject, text } = mailInfo;

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: googleEmail,
      pass: googleAppPass,
    },
  });

  const result = await transporter.sendMail({
    from: googleAlias,
    to: to,
    subject: subject,
    text: text,
  });
  return result;
}

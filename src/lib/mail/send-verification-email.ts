import { logger } from '@/logger'

import { mail } from '@/lib/mail/nodemailer'

import { template } from '../../utils/templates/verification-email-template'

const sender = {
  name: 'Social Media API',
  address: 'hi@gbmoraes.dev',
}

export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string,
) => {
  try {
    const email = await mail.sendMail({
      from: sender,
      to: to,
      subject: 'Verification Email',
      html: template.replace('{{firstName}}', name).replace('{{token}}', token),
    })

    logger.info({ data: email.messageId }, 'Email sent successfully:')
  } catch (error) {
    logger.error({ err: error }, 'Error sending email:')
  }
}

import amqp from 'amqplib'

import { env } from '@/env'

import { logger } from '@/logger'

import { sendVerificationEmail } from '@/lib/mail/send-verification-email'

const consumeMessages = async (queue: string) => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL)
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: true })

    logger.info(`Waiting for messages in ${queue}...`)

    channel.consume(queue, async (message) => {
      if (message) {
        try {
          const data = JSON.parse(message.content.toString())

          const { email, name, token } = data

          await sendVerificationEmail(email, name, token)

          logger.info({ data: data }, `Message processed from queue ${queue}:`)

          channel.ack(message)
        } catch (error) {
          logger.error({ err: error }, 'Error processing message:')
          channel.nack(message, false, true)
        }
      }
    })
  } catch (error) {
    logger.error({ err: error }, 'Error consuming messages:')
  }
}

consumeMessages('user_created')

import amqp from 'amqplib'

import { env } from '@/env'

import { logger } from '@/logger'

export const sendToQueue = async (queue: string, data: unknown) => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL)
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: true })

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    })

    logger.info({ data: data }, `Message sent to queue ${queue}:`)

    await channel.close()
    await connection.close()
  } catch (error) {
    logger.error({ err: error }, 'Error sending message to queue:')
  }
}

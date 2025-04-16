import 'dotenv/config'

import { z } from 'zod'

import { logger } from './logger'

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number().default(5432),
    DB_NAME: z.string(),
    RABBITMQ_USER: z.string(),
    RABBITMQ_PASSWORD: z.string(),
    RABBITMQ_PORT: z.coerce.number().default(5672),
  })
  .transform((data) => {
    const DB_HOST = data.NODE_ENV === 'production' ? 'postgresql' : 'localhost'

    const RABBITMQ_HOST =
      data.NODE_ENV === 'production' ? 'rabbitmq' : 'localhost'

    return {
      ...data,
      DB_HOST,
      RABBITMQ_HOST,
      RABBITMQ_URL: `amqp://${data.RABBITMQ_USER}:${data.RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${data.RABBITMQ_PORT}`,
      DATABASE_URL: `postgresql://${data.DB_USER}:${data.DB_PASSWORD}@${DB_HOST}:${data.DB_PORT}/${data.DB_NAME}`,
    }
  })

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  logger.error(
    { validationErrors: _env.error.format() },
    '⚠️ Invalid environment variables',
  )

  process.exit(1)
}

export const env = _env.data

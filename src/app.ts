import fastify from 'fastify'

import fastifyCors from '@fastify/cors'

import fastifyHelmet from '@fastify/helmet'

import fastifyRateLimit from '@fastify/rate-limit'

import fastifySwagger from '@fastify/swagger'

import fastifySwaggerUi from '@fastify/swagger-ui'

import { ZodError } from 'zod'

import { env } from './env'

import { logger } from './logger'

import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyHelmet, {
  contentSecurityPolicy: false,
})

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'social media',
      description: 'Especificações da API',
      version: '1.0.0',
    },
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    syntaxHighlight: {
      activate: true,
      theme: 'agate',
    },
  },
})

app.get('/healthcheck', async () => {
  return { status: 'ok' }
})

app.register(usersRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    logger.error({ err: error }, 'Unhandled error in request')
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

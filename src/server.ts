import { app } from './app'

import { env } from './env'

import { logger } from './logger'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    logger.info(`🚀 HTTP server is running on port ${env.PORT}`)
  })
  .catch((error) => {
    logger.error(
      { err: error },
      `❌ Failed to start the HTTP server on port ${env.PORT}`,
    )
  })

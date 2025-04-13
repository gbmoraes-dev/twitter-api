import { defineConfig } from 'drizzle-kit'

import { env } from '@/env'

export default defineConfig({
  schema: './src/db/schemas/index.ts',
  dialect: 'postgresql',
  out: './drizzle',
  schemaFilter: ['public'],
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})

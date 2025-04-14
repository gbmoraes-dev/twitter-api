import { defineConfig } from 'vitest/config'

import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: [
        'src/server.ts',
        'src/app.ts',
        'src/logger.ts',
        'src/env.ts',
        '**/*.config.ts',
        'src/utils/**',
        'src/lib/mail/**',
        'src/lib/queue/consumer.ts',
        'src/repositories/in-memory/**',
      ],
    },
  },
})

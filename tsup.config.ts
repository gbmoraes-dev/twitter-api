import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  outDir: 'build',
  format: 'esm',
  splitting: false,
  clean: true,
  target: 'es2022',
})

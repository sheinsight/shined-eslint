import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/eslint-rules.ts'],
  splitting: false,
  sourcemap: true,
  format: ['cjs', 'esm'],
  clean: true,
  target: 'node18',
  dts: true,
})

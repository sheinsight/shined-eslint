export const GLOB_SOURCE_CODE = '**/*.?([cm])[jt]s?(x)'

export const GLOB_JS = '**/*.?([cm])js'
export const GLOB_JSX = '**/*.?([cm])jsx'

export const GLOB_CJS = '**/*.?(c)[jt]s'
export const GLOB_ESM = '**/*.?(m)[jt]s'

export const GLOB_TS = '**/*.?([cm])ts'
export const GLOB_TSX = '**/*.?([cm])tsx'

export const GLOB_IGNORES_LIST = [
  '**/node_modules',
  '**/dist',
  '**/dist-*',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/bun.lockb',
  // '**/output',
  // '**/coverage',
  // '**/temp',
  // '**/tmp',
  '**/.temp',
  '**/.tmp',
  '**/.history',
  '**/.vitepress/cache',
  '**/.nuxt',
  '**/.next',
  '**/.svelte-kit',
  '**/.vercel',
  '**/.changeset',
  '**/.idea',
  '**/.cache',
  '**/.output',
  '**/.yarn',
  '**/*.min.*',
  '**/__snapshots__',
  '**/auto-import?(s).d.ts',
  '**/components.d.ts',
] as const

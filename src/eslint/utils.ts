import globals from 'globals'

export { default as globals } from 'globals'

import type { Awaitable, FlatConfigItem, OptionsGlobals } from './types.js'

export const DEFAULT_GLOBALS: Exclude<OptionsGlobals['globals'], undefined> = ['browser', 'node', 'es2022']
export const DEFAULT_GLOBALS_NODE: Exclude<OptionsGlobals['globals'], undefined> = ['node', 'es2022']

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (resolved as any).default || resolved
}

/**
 * Combine array and non-array configs into a single array.
 */
export async function combineFlatConfig(
  ...configs: Awaitable<FlatConfigItem | FlatConfigItem[]>[]
): Promise<FlatConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export function parseEnv(
  env: OptionsGlobals['globals'] = DEFAULT_GLOBALS,
): Record<string, 'readonly' | 'writable' | boolean> {
  let globalVars: Record<string, 'readonly' | 'writable' | boolean> = {}

  globalVars = Array.isArray(env)
    ? (Object.fromEntries(env.flatMap((key) => Object.entries(globals[key]))) as never)
    : { ...env }

  return globalVars
}

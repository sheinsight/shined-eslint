import { interopDefault } from '../utils.js'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export async function promise(options: OptionsRecommended = {}): Promise<FlatConfigItem[]> {
  const { recommended = true } = options

  // @ts-expect-error missing type file
  const promisePlugin = await interopDefault(await import('eslint-plugin-promise'))

  const config: FlatConfigItem[] = [
    {
      name: '@shined-eslint/promise/setup',
      plugins: {
        promise: promisePlugin,
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@shined-eslint/promise/recommended',
      rules: promisePlugin.configs.recommended.rules,
    })
  }

  return config
}

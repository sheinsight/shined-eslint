import { interopDefault } from '../utils.js'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export async function regexp(options: OptionsRecommended = {}): Promise<FlatConfigItem[]> {
  const { recommended = true } = options

  const regexpPlugin = await interopDefault(await import('eslint-plugin-regexp'))

  const config: FlatConfigItem[] = [
    {
      name: '@shined-eslint/regexp/setup',
      plugins: {
        regexp: regexpPlugin,
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@shined-eslint/regexp/recommended',
      rules: regexpPlugin.configs.recommended.rules,
    })
  }

  return config
}

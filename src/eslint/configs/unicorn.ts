import unicornPlugin from 'eslint-plugin-unicorn'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export { default as pluginUnicorn } from 'eslint-plugin-unicorn'

export function unicorn(options: OptionsRecommended = {}): FlatConfigItem[] {
  const { recommended = true } = options

  const config: FlatConfigItem[] = [
    {
      name: '@shined-eslint/unicorn/setup',
      plugins: {
        unicorn: unicornPlugin,
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@shined-eslint/unicorn/recommended',
      rules: unicornPlugin.configs['flat/recommended'].rules,
    })
  }

  return config
}

import { interopDefault } from '../utils.js'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export async function jsxA11y(options: OptionsRecommended = {}): Promise<FlatConfigItem[]> {
  const { recommended = true } = options

  const jsxA11yPlugin = await interopDefault(await import('eslint-plugin-jsx-a11y'))

  const config: FlatConfigItem[] = [
    {
      name: '@styled/jsx-a11y/setup',
      plugins: {
        'jsx-a11y': jsxA11yPlugin,
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@styled/jsx-a11y/recommended',
      rules: jsxA11yPlugin.configs.recommended.rules,
    })
  }

  return config
}

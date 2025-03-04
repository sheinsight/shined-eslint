import { interopDefault } from '../utils.js'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export { default as pluginReactRefresh } from 'eslint-plugin-react-refresh'

export async function reactRefresh(options: OptionsRecommended = {}): Promise<FlatConfigItem[]> {
  const { recommended = true } = options

  const reactRefreshPlugin = await interopDefault(await import('eslint-plugin-react-refresh'))

  const config: FlatConfigItem[] = [
    {
      name: '@styled/react-refresh/setup',
      plugins: {
        'react-refresh': reactRefreshPlugin,
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@styled/react-refresh/recommended',
      rules: reactRefreshPlugin.configs.recommended.rules,
    })
  }

  return config
}

import * as importX from 'eslint-plugin-import-x'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

// eslint-disable-next-line unicorn/prefer-export-from
export { importX as pluginImportX }

const rules: Record<string, any> = importX.flatConfigs.recommended.rules || {}

/**
 * 创建 `import` 相关的配置，内部使用 `eslint-plugin-import-x` 插件
 */
export function imports(options: OptionsRecommended = {}): FlatConfigItem[] {
  const { recommended = true } = options

  const config: FlatConfigItem[] = [
    {
      name: '@shined-eslint/imports/setup',
      plugins: {
        'import-x': importX,
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@shined-eslint/imports/recommended',
      rules: rules,
    })
  }

  return config
}

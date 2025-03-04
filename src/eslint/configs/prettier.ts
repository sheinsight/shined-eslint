import { interopDefault } from '../utils.js'

import type { FlatConfigItem } from '../types.js'

export { default as configPrettier } from 'eslint-config-prettier'

/**
 * 关闭 ESLint 现有配置中与 Prettier 冲突的规则
 */
export async function prettier(): Promise<FlatConfigItem[]> {
  const prettierConfig = await interopDefault(await import('eslint-config-prettier'))

  return [
    {
      name: '@styled/prettier/disable-conflicts',
      rules: prettierConfig.rules,
    },
  ]
}

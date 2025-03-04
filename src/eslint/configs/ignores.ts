import flatGitignore from 'eslint-config-flat-gitignore'
import { GLOB_IGNORES_LIST } from '../globs.js'

import type { FlatConfigItem, OptionsIgnores } from '../types.js'

export { default as pluginFlatGitignore } from 'eslint-config-flat-gitignore'

/**
 * 通用的全局文件忽略配置，用于全局忽略一些不需要进行代码检查的文件夹或文件
 *
 * @default { ignores: GLOB_IGNORES_LIST }
 */
export function ignores(options: OptionsIgnores = {}): FlatConfigItem[] {
  const { ignores = [] } = options

  return [
    {
      name: '@styled/common-ignores',
      ignores: [...GLOB_IGNORES_LIST, ...ignores], // 默认忽略一些常见的文件夹或文件
    },
    flatGitignore({
      name: '@styled/respect-gitignore',
      strict: false, // 遵循 `.gitignore` 文件进行文件忽略，不强制要求文件存在
    }),
  ]
}

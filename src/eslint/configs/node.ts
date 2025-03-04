import { GLOB_CJS, GLOB_ESM } from '../globs.js'
import { interopDefault } from '../utils.js'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export { default as pluginN } from 'eslint-plugin-n'

export interface ConfigOptionsNode extends OptionsRecommended {
  /**
   * node 代码类型，决定使用 ESM（module） 还是 CJS（commonjs），或者是 mixed（默认）
   *
   * 不同的类型会有「规则」和「全局变量」上的差异，如 ESM 下无法使用 `__dirname` 和 `__filename` 全局变量
   *
   * @default 'mixed'
   */
  type?: 'module' | 'commonjs' | 'mixed'
  /**
   * 是否开启 security 插件的规则
   *
   * @default false
   */
  security?: boolean
}

// const moduleSpecificGlobals: Linter.Globals = {
//   __dirname: 'off',
//   __filename: 'off',
//   exports: 'off',
//   module: 'off',
//   require: 'off',
// }

// const commonjsSpecificGlobals: Linter.Globals = {
//   __dirname: 'readonly',
//   __filename: 'readonly',
//   exports: 'writable',
//   module: 'readonly',
//   require: 'readonly',
// }

export async function node(options: ConfigOptionsNode = {}): Promise<FlatConfigItem[]> {
  const { type = 'mixed', security = false, recommended = true } = options

  const [nodePlugin, securityPlugin] = await Promise.all([
    interopDefault(await import('eslint-plugin-n')),
    security ? interopDefault(await import('eslint-plugin-security')) : undefined,
  ])

  const isMixed = type === 'mixed'
  const isPureESM = type === 'module'
  const isPureCJS = type === 'commonjs'

  const rules = {
    ...nodePlugin.configs.recommended.rules,
    ...(securityPlugin ? securityPlugin.configs.recommended.rules || {} : {}),
  }

  const files = isMixed ? [GLOB_CJS, GLOB_ESM] : isPureESM ? [GLOB_ESM] : [GLOB_CJS]

  const config: FlatConfigItem[] = [
    {
      name: '@styled/node/setup',
      files,
      plugins: {
        n: nodePlugin,
        ...(securityPlugin ? { security: securityPlugin } : {}),
      },
      languageOptions: {
        sourceType: isPureCJS ? 'commonjs' : 'module',
        ecmaVersion: 'latest',
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: isPureCJS ? 'commonjs' : 'module',
        },
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@styled/node/recommended',
      files,
      rules: rules,
    })
  }

  return config
}

import js from '@eslint/js'
import { GLOB_JS, GLOB_JSX } from '../globs.js'
import { DEFAULT_GLOBALS, parseEnv } from '../utils.js'

import type { FlatConfigItem, OptionsGlobals, OptionsJSX, OptionsRecommended } from '../types.js'

export { default as globals } from 'globals'
export { default as pluginJS } from '@eslint/js'

export interface ConfigOptionsJavascript extends OptionsJSX, OptionsGlobals, OptionsRecommended {}

/**
 * 创建 JavaScript 基础配置
 */
export function javascript(options: ConfigOptionsJavascript = {}): FlatConfigItem[] {
  const { globals: env = DEFAULT_GLOBALS, jsx = true, recommended = true } = options

  const config: FlatConfigItem[] = [
    {
      name: '@shined-eslint/javascript/setup',
      languageOptions: {
        ecmaVersion: 'latest',
        globals: parseEnv(env),
        parserOptions: {
          ecmaFeatures: { jsx },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        sourceType: 'module',
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@shined-eslint/javascript/recommended',
      files: [GLOB_JS, jsx ? GLOB_JSX : undefined].filter(Boolean) as string[],
      rules: js.configs.recommended.rules,
    })
  }

  return config
}

import ts from 'typescript-eslint'
import { GLOB_TS, GLOB_TSX } from '../globs.js'
import { DEFAULT_GLOBALS, parseEnv } from '../utils.js'

import type { ParserOptions as TypeScriptParserOptions } from '@typescript-eslint/parser'
import type * as TYPES from '../types.js'

export { default as pluginTS } from 'typescript-eslint'

export interface ConfigOptionsTypeScript
  extends TYPES.OptionsRecommended,
    TYPES.OptionsExtensions,
    TYPES.OptionsJSX,
    TYPES.OptionsGlobals,
    TYPES.OptionsParserOptions<TypeScriptParserOptions> {
  /**
   * 是否启用类型相关规则的检查，默认为 `false`
   *
   * 开启会走一遍 TS 类型检查拖慢速度，可自行权衡是否需要开启
   *
   * @default false
   */
  typeChecked?: boolean
}

/**
 * 创建 TypeScript 基础配置
 */
export function typescript(options: ConfigOptionsTypeScript = {}): TYPES.FlatConfigItem[] {
  const {
    globals: env = DEFAULT_GLOBALS,
    recommended = true,
    jsx: enableJSX = true,
    extensions = [],
    parserOptions = {},
    typeChecked = false,
  } = options

  const GLOBS = [GLOB_TS, enableJSX ? GLOB_TSX : undefined].filter(Boolean) as string[]
  const files = [...GLOBS, ...extensions.map((ext) => `**/*.${ext}`)]
  const configName = typeChecked ? 'typescript-eslint/recommended-type-checked' : 'typescript-eslint/recommended'
  const configPreset = ts.configs[typeChecked ? 'recommendedTypeChecked' : 'recommended']
  const recommendedRules = configPreset.find((c) => c.name === configName)?.rules ?? {}
  const conflictRules = ts.configs.eslintRecommended.rules || {}

  const config: TYPES.FlatConfigItem[] = [
    {
      name: '@styled/typescript/setup',
      plugins: {
        '@typescript-eslint': ts.plugin,
      },
    },
    {
      name: '@styled/typescript/parser',
      files,
      languageOptions: {
        parser: ts.parser as never,
        parserOptions: {
          ecmaFeatures: { jsx: enableJSX },
          sourceType: 'module',
          extraFileExtensions: extensions.map((extension) => `.${extension}`),
          ...(typeChecked
            ? {
                projectService: true,
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...parserOptions,
        } satisfies TypeScriptParserOptions,
        globals: parseEnv(env),
      },
    },
    {
      name: '@styled/typescript/disable-conflicts',
      files,
      // disable eslint built-in rules that conflict with TypeScript
      rules: conflictRules,
    },
  ]

  if (recommended) {
    config.push({
      name: '@styled/typescript/recommended',
      files,
      rules: recommendedRules,
    })
  }

  return config
}

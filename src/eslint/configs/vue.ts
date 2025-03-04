import ts from 'typescript-eslint'
import { DEFAULT_GLOBALS, interopDefault, parseEnv } from '../utils.js'

import type { FlatConfigItem, OptionsGlobals, OptionsRecommended, OptionsTypeScript, OptionsVue } from '../types.js'

export { default as pluginVue } from 'eslint-plugin-vue'
export { default as parserVue } from 'vue-eslint-parser'

export const GLOB_VUE = '**/*.vue'

export interface ConfigOptionsVue extends OptionsTypeScript, OptionsRecommended, OptionsVue, OptionsGlobals {}

/**
 * 创建 Vue 相关插件的配置，用于支持 Vue 项目的 ESLint 规则
 */
export async function vue(options: ConfigOptionsVue = {}): Promise<FlatConfigItem[]> {
  const { version: vueVersion = 3, recommended = true, globals: env = DEFAULT_GLOBALS, typescript = true } = options

  const isVue3 = !vueVersion || vueVersion === 3

  const [vuePlugin, vueParser] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
  ] as const)

  const config: FlatConfigItem[] = [
    {
      name: `@styled/vue${isVue3 ? '3' : '2'}/setup`,
      files: [GLOB_VUE],
      plugins: {
        vue: vuePlugin,
      },
      languageOptions: {
        globals: parseEnv(env),
        parser: vueParser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          extraFileExtensions: ['.vue'],
          parser: typescript ? ts.parser : undefined,
          sourceType: 'module',
        },
      },
    },
  ]

  if (recommended) {
    config.push({
      name: `@styled/vue${isVue3 ? '3' : '2'}/recommended`,
      files: [GLOB_VUE],
      rules: {
        ...vuePlugin.configs[isVue3 ? 'vue3-recommended' : 'recommended'].rules,
        'vue/component-tags-order': 'off', // 废弃规则
      },
    })
  }

  return config
}

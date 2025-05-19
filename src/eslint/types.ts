import type globals from 'globals'
import type { Linter } from 'eslint'
import type { ConfigNames, RuleOptions } from '../@types/generated-types.js'

// 通过脚本动态生成的 TS 类型
export type GenConfigNames = ConfigNames
export type GenRules = RuleOptions

export type GlobalsKeys = keyof typeof globals
export type Arrayable<T> = T | T[]
export type Awaitable<T> = T | Promise<T>

export type ShinedESLintRules = Linter.RulesRecord & GenRules

export type FlatConfigItem = Omit<Linter.Config<ShinedESLintRules>, 'plugins'> & {
  // 放开插件类型限制避免 TS 误报，因为很多插件的类型还没准备好
  plugins?: Record<string, any>
}

export interface OptionsIgnores {
  /**
   * 额外忽略文件的 glob 匹配规则列表，内置了一些默认的忽略规则（GLOB_IGNORES_LIST）
   *
   * 通常情况下，会默认忽略所有 .gitignore 文件中的规则，如果需要忽略更多的文件，可以通过此选项配置
   *
   * @default []
   */
  ignores?: string[]
}

export interface OptionsVue {
  /**
   * Vue 版本，用于支持不同版本的 Vue 项目
   *
   * @default 3
   */
  version?: 2 | 3
}

export interface OptionsExtensions {
  /**
   * 额外的文件扩展名，用于支持不同的文件类型
   *
   * @example ['astro', 'svelte']
   *
   * @default []
   */
  extensions?: string[]
}

export interface OptionsJSX {
  /**
   * 是否启用 JSX，用于支持 React/Vue/Astro 等 JSX 语法
   *
   * @default true
   */
  jsx?: boolean
}

export interface OptionsGlobals {
  /**
   * 限制全局变量，提前发现并防止 Node.js 环境下访问浏览器环境的全局变量等隐性错误
   *
   * @default ["browser", "node", "es2020"]
   */
  globals?: GlobalsKeys[] | Record<string, 'readonly' | 'writable' | boolean>
}

export interface OptionsParserOptions<T extends Record<string, any>> {
  /**
   * 额外的解析器选项，用于支持更多的解析器配置
   *
   * @default {}
   */
  parserOptions?: Partial<T>
}

export interface OptionsTypeScript {
  /**
   * 是否启用 TypeScript，用于支持 TypeScript 解析和语法，启用后，部分规则会自动切换到 TypeScript 版本
   *
   * 例如 `@typescript-eslint/no-unused-vars`
   *
   * @default true
   */
  typescript?: boolean
}

export interface OptionsRecommended {
  /**
   * 是否启用各个预设的所有推荐配置，默认开启，如果关闭则只会开启内部规范要求强制开启的规则。
   *
   * 老项目短期内难以迁移或整改的可以关闭，如果对自己的项目要求严格或者是新起的项目，则强烈推荐开启。
   *
   * @default true
   */
  recommended?: boolean
}

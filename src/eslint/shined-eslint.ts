/* eslint-disable @typescript-eslint/no-floating-promises */
import { DEFAULT_GLOBALS, DEFAULT_GLOBALS_NODE } from './utils.js'
import { FlatConfigComposer } from 'eslint-flat-config-utils'

import { getInternalPresets } from './configs/internal/presets.js'
import { ignores } from './configs/ignores.js'
import { imports } from './configs/imports.js'
import { javascript } from './configs/javascript.js'
import { jsxA11y } from './configs/jsx-a11y.js'
import { node } from './configs/node.js'
import { prettier } from './configs/prettier.js'
import { promise } from './configs/promise.js'
import { react } from './configs/react.js'
import { reactRefresh } from './configs/react-refresh.js'
import { regexp } from './configs/regexp.js'
import { typescript } from './configs/typescript.js'
import { unicorn } from './configs/unicorn.js'
import { vue } from './configs/vue.js'

import type { ConfigOptionsNode } from './configs/node.js'
import type { ConfigOptionsReact } from './configs/react.js'
import type { ConfigOptionsTypeScript } from './configs/typescript.js'
import type * as TYPES from './types.js'

export interface ShinedESLintOptions
  extends TYPES.OptionsIgnores,
    TYPES.OptionsGlobals,
    TYPES.OptionsJSX,
    TYPES.OptionsRecommended {
  /**
   * 是否启用 TypeScript，用于支持 TypeScript 解析和语法，启用后，部分规则会自动切换到 TypeScript 版本
   *
   * 如: `no-unused-vars` 将会被关闭，切换为 `ts/no-unused-vars`
   *
   * @default true
   */
  typescript?: boolean | Pick<ConfigOptionsTypeScript, 'parserOptions' | 'typeChecked'>
  /**
   * 是否启用 React，用于支持 React 解析和语法
   *
   * @default true
   */
  react?: boolean | Pick<ConfigOptionsReact, 'jsxRuntime'>
  /**
   * 是否和 Prettier 搭配使用，开启后，会关闭当前 ESLint 所有规则中与 Prettier 的冲突规则
   *
   * @default true
   */
  prettier?: boolean
  /**
   * 是否启用 Node.js 支持，用于支持 Node.js 特定的全局变量和规则
   *
   * 开启后，globals 会自动切换到 Node.js 版本（移除 browser 环境的全局变量）
   *
   * 如果是 SSR 等环境，可以自行使用导出的 DEFAULT_GLOBALS（包含 node、browser、es2022） 常量来补全全局变量
   *
   * @default false
   */
  node?: boolean | Pick<ConfigOptionsNode, 'type' | 'security'>
  /**
   * 是否启用 Vue.js 支持，用于支持 Vue.js 解析和语法，启用后，Vue 文件的部分规则会自动切换到 Vue.js 版本
   *
   * @default false
   */
  vue?: boolean | Pick<TYPES.OptionsVue, 'version'>
  /**
   * 额外开启的预设插件
   *
   * 用于启用 Styled 内置但没有默认开启的 ESLint 插件，如 promise、regexp 等
   *
   * @default []
   */
  extraPlugins?: ('unicorn' | 'react-refresh' | 'promise' | 'regexp' | 'jsx-a11y')[]
}

/**
 * 创建 Shined ESLint 基础配置，对齐内部相关前端规范，内置支持 JS/TS/JSX/TSX，也支持 Node.js/Browser 等不同环境，可以通过传入配置动态切换
 *
 * @see TODO: 附上内部的规范链接
 */
export function shinedESLint(
  options: ShinedESLintOptions = {},
  ...extraConfigs: TYPES.FlatConfigItem[]
): FlatConfigComposer<TYPES.FlatConfigItem, TYPES.GenConfigNames> {
  const {
    ignores: userIgnores,

    typescript: enableTS = true,
    react: enableReact = true,
    node: enableNodejs = false,
    vue: enableVue = false,
    prettier: enablePrettier = true,
    extraPlugins = [],

    jsx = true,
    globals = enableNodejs ? DEFAULT_GLOBALS_NODE : DEFAULT_GLOBALS,
    recommended = true,
  } = options

  // 是否禁用内部预设规则，可通过环境变量 `SHINED_ESLINT_NO_INTERNAL_RULE` 进行禁用
  const disableInternalSpecific = !!process.env.SHINED_ESLINT_NO_INTERNAL_RULE

  const composer = new FlatConfigComposer<TYPES.FlatConfigItem, TYPES.GenConfigNames>([])

  // 设置 gitignore 规则，遵循 gitignore 文件进行忽略
  composer.append(ignores({ ignores: userIgnores }))

  // 设置 JavaScript 相关规则
  composer.append(javascript({ globals, jsx }))

  // 设置 TypeScript 相关规则
  const tsOptions = typeof enableTS === 'object' ? enableTS : {}
  if (enableTS) {
    composer.append(
      typescript({
        recommended,
        globals,
        jsx,
        // 后续如有 astro、svelte 等再放开，目前收拢配置，只额外支持 vue 解析
        extensions: enableVue ? ['vue'] : [],
        ...tsOptions,
      }),
    )
  }

  // 设置 import-x 相关规则
  composer.append(imports({ recommended }))

  // 设置 React 和 React Hooks 相关规则
  const reactOptions = typeof enableReact === 'object' ? enableReact : {}

  if (enableReact) {
    composer.append(react({ recommended, jsxRuntime: 'automatic', ...reactOptions }))
  }

  // 设置 unicorn 预设的相关规则
  composer.append(unicorn({ recommended: extraPlugins.includes('unicorn') && recommended }))

  // 设置 Node.js 相关规则
  const nodeOptions = typeof enableNodejs === 'object' ? enableNodejs : {}

  if (enableNodejs) {
    composer.append(node({ recommended, type: 'module', ...nodeOptions }))
  }

  // 设置 Vue.js 相关规则
  if (enableVue) {
    const vueOptions: TYPES.OptionsVue = enableVue === true ? { version: 3 } : enableVue
    composer.append(vue({ ...vueOptions, recommended, globals, typescript: !!enableTS } as TYPES.OptionsVue))
  }

  // 设置额外的插件规则, 如 promise、regexp 等
  if (extraPlugins.includes('jsx-a11y')) composer.append(jsxA11y({ recommended }))
  if (extraPlugins.includes('react-refresh')) composer.append(reactRefresh({ recommended }))
  if (extraPlugins.includes('promise')) composer.append(promise({ recommended }))
  if (extraPlugins.includes('regexp')) composer.append(regexp({ recommended }))

  if (!disableInternalSpecific) {
    // 设置内部统一的 ESLint 预设规则
    composer.append(
      getInternalPresets({
        recommended,
        level: 'all',
        typescript: !!enableTS,
        react: !!enableReact,
        node: !!enableNodejs,
        vue: !!enableVue,
        jsxRuntime: reactOptions.jsxRuntime,
      }),
    )
  }

  // let projectName = '[本项目]'

  // try {
  //   const pname = JSON.parse(fs.readFileSync('package.json', 'utf8'))?.name
  //   projectName += ` ${(pname || '请配置 package.json#name').replace('/', '_')}`
  // } catch {
  //   // ignored
  // }

  // 设置项目范围内的自定义的规则，可以覆盖强制开启的规则
  // composer.append(extraConfigs.map((e) => ({ ...e, name: `${projectName}/${e.name || 'unknown'}` })))

  // 部分团队需要再次封装，以便于自定义规则
  composer.append(extraConfigs.map((e) => ({ ...e, name: e.name || 'Unknown' })))

  // 设置 Prettier 相关规则，用于禁用 ESLint 中与 Prettier 的冲突规则
  if (enablePrettier) {
    composer.append(prettier())
  }

  // 是否跳过强制开启报错的规则
  if (!disableInternalSpecific) {
    composer.append(
      getInternalPresets({
        recommended,
        level: 'error',
        typescript: !!enableTS,
        react: !!enableReact,
        node: !!enableNodejs,
        vue: !!enableVue,
        jsxRuntime: reactOptions.jsxRuntime,
      }),
    )
  }

  return composer
}

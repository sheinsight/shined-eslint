import { interopDefault } from '../utils.js'

import type { FlatConfigItem, OptionsRecommended } from '../types.js'

export { default as pluginReact } from 'eslint-plugin-react'
export { default as pluginReactHooks } from 'eslint-plugin-react-hooks'

const RULE_MAP = ['off', 'warn', 'error'] as const

export interface ConfigOptionsReact extends OptionsRecommended {
  /**
   * React 的 jsx-runtime 类型，用于支持 React 17 的新特性 jsx-runtime
   *
   * classic 模式下，需要显式引入 React: `import React from 'react'`
   *
   * @default 'automatic'
   */
  jsxRuntime?: 'automatic' | 'classic'
}

export async function react(options: ConfigOptionsReact = {}): Promise<FlatConfigItem[]> {
  const { jsxRuntime = 'automatic', recommended = true } = options

  const [reactPlugin, reactHooksPlugin] = await Promise.all([
    interopDefault(await import('eslint-plugin-react')),
    interopDefault(await import('eslint-plugin-react-hooks')),
  ])

  const isJSXRuntimeAutomatic = jsxRuntime === 'automatic'
  const allRules = reactPlugin.configs.recommended.rules
  const reactRules = Object.fromEntries(Object.entries(allRules).map(([k, v]) => [k, RULE_MAP[v]]))
  const reactHooksRules = reactHooksPlugin.configs.recommended.rules || {}

  const config: FlatConfigItem[] = [
    {
      name: '@shined-eslint/react/setup',
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ]

  if (recommended) {
    config.push({
      name: '@shined-eslint/react/recommended',
      rules: {
        ...reactRules,
        ...reactHooksRules,
        'react/react-in-jsx-scope': isJSXRuntimeAutomatic ? 'off' : 'warn',
      },
    })
  }

  return config
}

import type { FlatConfigItem, GenRules, OptionsRecommended, OptionsTypeScript, ShinedESLintRules } from '../../types.js'
import type { Linter } from 'eslint'
import type { ConfigOptionsReact } from '../react.js'

export interface OptionsInternalPreset extends OptionsTypeScript, OptionsRecommended {}

const noUnusedVarsConfig: Exclude<GenRules['@typescript-eslint/no-unused-vars'], undefined> = [
  'warn',
  {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    ignoreRestSiblings: true,
  },
]

export function internalCommon(options?: OptionsInternalPreset): ShinedESLintRules {
  const { recommended = true, typescript: enableTS = true } = options || {}

  const rules: ShinedESLintRules = {
    // ESLint Core
    'constructor-super': 'error',
    'for-direction': 'error',
    'getter-return': ['error', { allowImplicit: true }],
    'no-async-promise-executor': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'error',
    'no-const-assign': 'error',
    'no-constant-binary-expression': 'error',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-delete-var': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-else-if': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-empty-pattern': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-ex-assign': 'error',
    'no-fallthrough': 'error',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-import-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'error',
    'no-loss-of-precision': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-obj-calls': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': ['error', { builtinGlobals: false }],
    'no-regex-spaces': 'error',
    'no-self-assign': 'error',
    'no-setter-return': 'error',
    'no-shadow-restricted-names': 'error',
    'no-sparse-arrays': 'error',
    'no-this-before-super': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': ['error', { enforceForOrderingRelations: true }],
    'no-unsafe-optional-chaining': 'error',
    'no-unused-labels': 'error',
    'no-useless-catch': 'error',
    'no-useless-escape': 'error',
    'use-isnan': ['error', { enforceForIndexOf: true }],
    'valid-typeof': 'error',

    // Import
    'import-x/export': 'error',

    'import-x/no-unresolved': 'off', // 太容易误判，始终禁用
    'import-x/named': 'off', // 太容易误判，始终禁用
    'import-x/namespace': 'off', // 太容易误判，始终禁用

    // Unicorn
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-thenable': 'error',
    'unicorn/no-unreadable-array-destructuring': 'error',
    'unicorn/require-array-join-separator': 'error',
    'unicorn/require-number-to-fixed-digits-argument': 'error',

    ...(enableTS && {
      // TypeScript
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
    }),

    // Recommended
    ...(recommended && {
      'no-unused-vars': noUnusedVarsConfig,

      ...(enableTS && {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': noUnusedVarsConfig,
      }),
    }),
  }

  return rules
}

export function internalReact(
  options?: OptionsInternalPreset & {
    /**
     * 是否启用 JSX runtime, 将会动态决定是否启用 `react/jsx-runtime` 等规则
     *
     * @default true
     */
    enableJsxRuntime?: boolean
  },
): Record<string, Linter.RuleEntry> {
  const { enableJsxRuntime = true } = options || {}

  const rules: Record<string, Linter.RuleEntry> = {
    // React
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error', // 用来解决和 un-used-vars 检测的冲突
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-unescaped-entities': 'error',
    'react/react-in-jsx-scope': enableJsxRuntime ? 'off' : 'error',
    'react/require-render-return': 'error',

    // React Hooks
    'react-hooks/exhaustive-deps': 'off', // 规则争议较大，始终禁用
  }

  return rules
}

export function internalNodejs(_options?: OptionsInternalPreset): Record<string, Linter.RuleEntry> {
  return {}
}

export function internalVue(_options?: OptionsInternalPreset): Record<string, Linter.RuleEntry> {
  return {}
}

export function internalPresets(
  options?: {
    recommended?: boolean
    level?: string
    vue?: boolean
    react?: boolean
    node?: boolean
    jsxRuntime?: ConfigOptionsReact['jsxRuntime']
  } & OptionsTypeScript,
): FlatConfigItem {
  const {
    recommended,
    level,
    typescript = true,
    react = true,
    vue = false,
    node = false,
    jsxRuntime = 'classic',
  } = options || {}

  const config = { recommended, typescript }

  const internalAllRules = {
    ...internalCommon(config),
    ...(react ? internalReact({ ...config, enableJsxRuntime: jsxRuntime === 'classic' }) : {}),
    ...(vue ? internalVue(config) : {}),
    ...(node ? internalNodejs(config) : {}),
  }

  const rules =
    level === 'error'
      ? Object.fromEntries(
          Object.entries(internalAllRules).filter(([_, value = '']) => {
            const isStringMatch = !Array.isArray(value) && ['error', 2].includes(value)
            const isArrayMatch = Array.isArray(value) && ['error', 2].includes(value[0])
            return isStringMatch || isArrayMatch
          }),
        )
      : Object.fromEntries(Object.entries(internalAllRules))

  return {
    name: `@shined-eslint/internal/${recommended ? 'recommended' : 'custom'}-${level === 'error' ? 'enforce-error' : 'common'}`,
    rules: rules,
  }
}

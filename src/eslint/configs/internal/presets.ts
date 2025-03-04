import tsESLint from 'typescript-eslint'

import type { FlatConfigItem, GenRules, OptionsRecommended, OptionsTypeScript } from '../../types.js'
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

export function internalCommon(options?: OptionsInternalPreset): Record<string, Linter.RuleEntry> {
  const { recommended = true, typescript: enableTS = true } = options || {}

  const disabledConflictRules = Object.fromEntries(
    Object.entries(tsESLint.configs.eslintRecommended.rules || {}).filter(([_key, value = '']) => {
      const isStringMatch = !Array.isArray(value) && ['off', 0].includes(value)
      const isArrayMatch = Array.isArray(value) && ['off', 0].includes(value[0])
      return isStringMatch || isArrayMatch
    }),
  )

  const rules: Record<string, Linter.RuleEntry> = {
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
    'no-debugger': recommended ? 'error' : 'off', // 根据投票结果，决定禁用
    'no-delete-var': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-else-if': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-empty-pattern': 'error',
    'no-empty-static-block': recommended ? 'error' : 'off', // 禁用
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': recommended ? 'error' : 'off', // 禁用
    'no-fallthrough': 'error',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-import-assign': 'error',
    'no-inner-declarations': 'error', // 不再是 ESLint 默认规则
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'error',
    'no-loss-of-precision': 'error',
    'no-misleading-character-class': recommended ? 'error' : 'off', // 待定
    'no-new-native-nonconstructor': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-obj-calls': 'error',
    'no-octal': recommended ? 'error' : 'off', // 禁用
    'no-prototype-builtins': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-self-assign': 'error',
    'no-setter-return': 'error',
    'no-shadow-restricted-names': 'error',
    'no-sparse-arrays': 'error',
    'no-this-before-super': 'error',
    'no-undef': recommended ? 'error' : 'off', // 根据投票结果，决定禁用
    'no-unexpected-multiline': recommended ? 'error' : 'off', // 与 prettier 冲突，暂时关闭
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': ['error', { enforceForOrderingRelations: true }],
    'no-unsafe-optional-chaining': 'error',
    'no-unused-labels': 'error',
    'no-unused-private-class-members': recommended ? 'error' : 'off', // 禁用
    'no-unused-vars': recommended ? noUnusedVarsConfig : 'off', // 根据投票结果，决定禁用
    'no-useless-backreference': recommended ? 'error' : 'off', // 禁用
    'no-useless-catch': 'error',
    'no-useless-escape': 'error',
    'no-with': recommended ? 'error' : 'off', // 禁用
    'require-yield': recommended ? 'error' : 'off', // 禁用
    'use-isnan': ['error', { enforceForIndexOf: true }],
    'valid-typeof': 'error',

    // Import
    'import-x/export': 'error',
    'import-x/no-unresolved': 'off', // 太容易误判，始终禁用
    'import-x/default': recommended ? 'error' : 'off', // 禁用
    'import-x/named': 'off', // 太容易误判，始终禁用
    'import-x/namespace': 'off', // 太容易误判，始终禁用
    'import-x/no-duplicates': recommended ? 'error' : 'off', // 禁用
    'import-x/no-named-as-default-member': recommended ? 'error' : 'off', // 禁用
    'import-x/no-named-as-default': recommended ? 'error' : 'off', // 禁用

    // Unicorn
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-thenable': 'error',
    'unicorn/no-unreadable-array-destructuring': 'error',
    'unicorn/require-array-join-separator': 'error',
    'unicorn/require-number-to-fixed-digits-argument': 'error',

    ...(enableTS
      ? {
          // 禁用 ESLint 冲突的规则
          ...disabledConflictRules,

          // 关闭 TypeScript 比较严格的规则
          '@typescript-eslint/ban-ts-comment': recommended ? 'error' : 'off',
          '@typescript-eslint/no-array-constructor': recommended ? 'error' : 'off',
          '@typescript-eslint/no-empty-object-type': recommended ? 'error' : 'off',
          '@typescript-eslint/no-explicit-any': recommended ? 'error' : 'off',
          '@typescript-eslint/no-namespace': recommended ? 'error' : 'off',
          '@typescript-eslint/no-require-imports': recommended ? 'error' : 'off',
          '@typescript-eslint/no-this-alias': recommended ? 'error' : 'off',
          '@typescript-eslint/no-unnecessary-type-constraint': recommended ? 'error' : 'off',
          '@typescript-eslint/no-unused-expressions': recommended ? 'error' : 'off',
          '@typescript-eslint/prefer-as-const': recommended ? 'error' : 'off',
          '@typescript-eslint/triple-slash-reference': recommended ? 'error' : 'off',

          ...(recommended ? { 'no-unused-vars': 'off' } : {}), // 和下一条冲突，但没在默认禁用的规则中  // 根据投票结果，决定禁用
          '@typescript-eslint/no-unused-vars': recommended ? noUnusedVarsConfig : 'off', // 根据投票结果，决定禁用

          '@typescript-eslint/no-duplicate-enum-values': 'error',
          '@typescript-eslint/no-extra-non-null-assertion': 'error',
          '@typescript-eslint/no-misused-new': 'error',
          '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
          '@typescript-eslint/no-unsafe-declaration-merging': 'error',
          '@typescript-eslint/no-unsafe-function-type': 'error',
          '@typescript-eslint/no-wrapper-object-types': 'error',
          '@typescript-eslint/prefer-namespace-keyword': 'error',
        }
      : {}),
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
  const { recommended = true, enableJsxRuntime = true } = options || {}

  const rules: Record<string, Linter.RuleEntry> = {
    // React
    'react/display-name': recommended ? 'error' : 'off', // 禁用
    'react/jsx-key': [recommended ? 'error' : 'off', { warnOnDuplicates: true }], // 根据投票结果，决定禁用
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error', // 用来解决和 un-used-vars 检测的冲突
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': recommended ? 'error' : 'off', // 禁用
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'off', // 禁用
    'react/no-unsafe': 'off', // 禁用
    'react/prop-types': 'off', // 禁用
    'react/react-in-jsx-scope': enableJsxRuntime ? 'off' : 'error',
    'react/require-render-return': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': recommended ? 'error' : 'off', // 根据投票结果，决定禁用
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

export function getInternalPresets(
  options?: {
    level?: 'all' | 'error'
    vue?: boolean
    react?: boolean
    node?: boolean
    jsxRuntime?: ConfigOptionsReact['jsxRuntime']
  } & OptionsTypeScript,
): FlatConfigItem {
  const {
    level = 'all',
    typescript = true,
    react = true,
    vue = false,
    node = false,
    jsxRuntime = 'classic',
  } = options || {}

  const config = {
    recommended: level === 'all',
    typescript: !!typescript,
  }

  const internalEnforceErrorAllRules = {
    ...internalCommon(config),
    ...(react
      ? internalReact({
          ...config,
          enableJsxRuntime: jsxRuntime === 'classic',
        })
      : {}),
    ...(vue ? internalVue(config) : {}),
    ...(node ? internalNodejs(config) : {}),
  }

  const rules = config.recommended
    ? Object.fromEntries(Object.entries(internalEnforceErrorAllRules))
    : Object.fromEntries(
        Object.entries(internalEnforceErrorAllRules).filter(([_, value = '']) => {
          const isStringMatch = !Array.isArray(value) && ['error', 2].includes(value)
          const isArrayMatch = Array.isArray(value) && ['error', 2].includes(value[0])
          return isStringMatch || isArrayMatch
        }),
      )

  return {
    name: `@styled/internal/${config.recommended ? 'common' : 'enforce-error'}`,
    rules: rules,
  }
}

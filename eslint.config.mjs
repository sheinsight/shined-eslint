import shinedESLint from '@shined/styled-eslint'

export default shinedESLint(
  // styled eslint 配置
  {
    recommended: true,
    typescript: {
      typeChecked: true, // 默认关闭以提高性能，这里设为 true 以开启类型检查,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['tsup.config.ts'],
        },
      },
    },
    react: {
      jsxRuntime: 'classic',
    },
    vue: {
      version: 3,
    },
    node: {
      type: 'module',
      security: true,
    },
    jsx: true,
    extraPlugins: ['jsx-a11y', 'promise', 'react-refresh', 'regexp', 'unicorn'],
  },

  // 本项目的配置
  {
    name: 'this-project',
    ignores: ['fixtures/**/*'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      'n/no-missing-import': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',

      'promise/always-return': 'off',

      'unicorn/no-empty-file': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },

  // 用于 fixtures 目录下 Vue 相关文件的测试
  {
    name: 'fixture-vue-specific',
    files: ['fixtures/**/*.vue'],
    rules: {
      'vue/eqeqeq': 'error',
    },
  },
)

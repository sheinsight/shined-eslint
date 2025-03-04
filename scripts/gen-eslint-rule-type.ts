import fs from 'node:fs/promises'

import { builtinRules } from 'eslint/use-at-your-own-risk'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'

import {
  combineFlatConfig,
  ignores,
  imports,
  javascript,
  jsxA11y,
  node,
  prettier,
  promise,
  react,
  reactRefresh,
  regexp,
  internalCommon,
  internalNodejs,
  internalReact,
  internalVue,
  typescript,
  unicorn,
  vue,
} from '../src/eslint/index.js'

const configs = await combineFlatConfig(
  { plugins: { '': { rules: Object.fromEntries(builtinRules.entries()) } } },
  ignores(),
  imports(),
  javascript(),
  jsxA11y(),
  node({ security: true }),
  prettier(),
  promise(),
  react(),
  reactRefresh(),
  regexp(),
  internalCommon(),
  internalNodejs(),
  internalReact(),
  internalVue(),
  typescript({
    typeChecked: true,
  }),
  unicorn(),
  vue(),
)

const configNames = configs.map((c) => c.name).filter(Boolean) as string[]

let dts = `
// ===========================================
//  THIS FILE IS AUTO GENERATED. DO NOT EDIT. 
// ===========================================
`

dts += await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `

/** Generated names of all the flat ESLint configs */
export type ConfigNames = ${configNames.map((c) => `'${c}'`).join(' | ')}
`

await fs.writeFile('src/@types/generated-types.ts', dts)

const ruleCount = configs.reduce((acc, c) => acc + Object.keys(c.rules || {}).length, 0)

console.log(`${ruleCount} Rules types generated successfully in \`src/eslint/generated-types.d.ts\``)

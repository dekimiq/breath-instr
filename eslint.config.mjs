import { dirname } from 'path'
import { fileURLToPath } from 'url'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import unusedImports from 'eslint-plugin-unused-imports'
import importHelpers from 'eslint-plugin-import-helpers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**'] },
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'unused-imports': unusedImports,
      'import-helpers': importHelpers,
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      // Unused Imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Import Helpers
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            '/^react/',
            'module',
            '/^@\\/components/',
            '/^@\\/hooks/',
            '/^@\\/store/',
            '/^@\\/services/',
            '/^@\\/utils/',
            '/^@\\/types/',
            '/^@\\/styles/',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
    },
  },
]

export default eslintConfig

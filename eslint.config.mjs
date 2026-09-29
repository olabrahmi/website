import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import filenamesPlugin from 'eslint-plugin-filenames-simple';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      tsPlugin,
      importPlugin,
      prettierPlugin,
      'unused-imports': unusedImportsPlugin,
      'filenames-simple': filenamesPlugin,
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],
      'import/no-unresolved': 2,
      'import/named': 2,
      'import/no-relative-packages': 2,
      'import/no-cycle': 0,
      'import/newline-after-import': 2,
      'import/no-namespace': 0,
      'import/no-duplicates': 2,
      'import/first': 2,
      'import/exports-last': 0,
      'import/no-absolute-path': 2,
      'import/no-dynamic-require': 2,
      'import/no-self-import': 2,
      'import/no-useless-path-segments': 2,
      'import/no-extraneous-dependencies': [
        2,
        {
          devDependencies: ['tailwind.config.ts'],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'filenames-simple/naming-convention': ['error', { rule: 'kebab-case', excepts: ['_.*', '[0-9]*', '\\[(.*?)'] }],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/internal-regex': '^@/',
      'import/resolver': {
        typescript: true,
      },
    },
  },
  globalIgnores([
    'public/**',
    '.next/**',
    '.github/**',
    '.husky/**',
    '.vercel/**',
    'out/**',
    'next-env.d.ts',
    'pnpm-lock.yaml',
    'node_modules/**',
  ]),
]);

export default eslintConfig;

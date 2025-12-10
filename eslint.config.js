// Plugins
import eslint from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactPluginHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import vitest from '@vitest/eslint-plugin';
// Configurations
import typescriptParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

// Workaround, see: https://github.com/facebook/react/issues/28313
const reactHooksRecommended = {
  name: 'react-hooks',
  plugins: {
    'react-hooks': reactPluginHooks,
  },
  rules: reactPluginHooks.configs.recommended.rules,
};

const configForTestFiles = {
  name: 'test',
  files: ['**/*.test.ts', '**/*.test.tsx'],
  extends: [vitest.configs.recommended],
};

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  jsxA11y.flatConfigs.recommended,
  sonarjs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooksRecommended,
  configForTestFiles,
  eslintConfigPrettier,
  {
    name: 'settings',
    ignores: ['eslint.config.js', 'vite.config.ts', 'playwright.config.ts'],
    settings: {
      // Config: https://github.com/jsx-eslint/eslint-plugin-react#configuration
      react: {
        version: 'detect',
      },
      'import/resolver': {
        // Config: https://github.com/import-js/eslint-import-resolver-typescript
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Overriding the sonarJS rule for use of void. It has a flaw that prevents void from being used
  // https://sonarsource.atlassian.net/browse/JS-525
  {
    files: ['**/*.tsx', '**/*.ts', '**/*.js'],
    rules: {
      'sonarjs/void-use': 'off',
      'sonarjs/todo-tag': 'off',
    },
  },
);

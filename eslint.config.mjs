import bpmnIoPlugin from 'eslint-plugin-bpmn-io';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const files = {
  ignored: ['packages/**/dist/*', 'node_modules', 'packages/**/types/*', 'coverage'],
  browser: ['packages/**/src/**/*.js'],
  test: ['packages/**/test/**/*'],
  node: [
    'e2e/visual/**/*',
    'tasks/**/*',
    'packages/**/tasks/**/*',
    'packages/**/karma.conf.js',
    'packages/**/rollup.config.js',
    'vite.config.js',
  ],
};

export default [
  {
    ignores: files.ignored,
  },

  // Base configuration for all files
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },

  // Browser + JSX configuration
  ...bpmnIoPlugin.configs.browser.map((config) => ({
    ...config,
    files: files.browser,
  })),
  ...bpmnIoPlugin.configs.jsx.map((config) => ({
    ...config,
    files: [...files.browser, ...files.test],
  })),

  // Node configuration
  ...bpmnIoPlugin.configs.node.map((config) => ({
    ...config,
    files: [...files.node, ...files.test],
  })),

  // React Hooks configuration
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
    files: files.browser,
  },

  // Import rules
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/first': 'error',
      'import/no-amd': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          basePath: './packages',
          zones: [
            {
              target: 'form-js/src',
              from: '.',
              except: ['form-js'],
            },
            {
              target: 'form-js-editor/src',
              from: '.',
              except: ['form-js-editor'],
            },
            {
              target: 'form-js-playground/src',
              from: '.',
              except: ['form-js-playground'],
            },
            {
              target: 'form-js-viewer/src',
              from: '.',
              except: ['form-js-viewer'],
            },
          ],
        },
      ],
    },
  },

  ...bpmnIoPlugin.configs.mocha.map((config) => {
    return {
      ...config,
      files: files.test,
    };
  }),
  {
    languageOptions: {
      globals: {
        sinon: true,
        require: true,
        ...globals.browser,
        ...globals.mocha,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: files.test,
  },

  eslintConfigPrettier,
];

import css from 'rollup-plugin-css-only';

import babel from '@rollup/plugin-babel';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    babel({
      babelHelpers: 'bundled',
      plugins: [
        [ '@babel/plugin-transform-react-jsx', {
          'importSource': 'preact',
          'runtime': 'automatic'
        } ]
      ]
    }),
    css({
      output: 'assets/form-js-playground.css'
    }),
    ...plugins
  ];

}

export default [
  {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'commonjs',
        file: pkg.main
      },
      {
        sourcemap: true,
        format: 'esm',
        file: pkg.module
      }
    ],
    plugins: pgl(),
    external: [
      'preact',
      'preact/hooks',
      'file-drops',
      'mitt',
      'downloadjs',
      '@bpmn-io/form-js-editor',
      '@bpmn-io/form-js-viewer',
      'preact/jsx-runtime',
      '@codemirror/state',
      '@codemirror/lang-json',
      '@codemirror/lint',
      '@codemirror/view',
      '@codemirror/commands',
      '@codemirror/autocomplete',
      '@codemirror/language',
      'codemirror',
      'classnames'
    ],
    onwarn
  },
  {
    input: 'src/index.js',
    output: [
      {
        format: 'umd',
        file: pkg['umd:main'],
        name: 'FormPlayground'
      }
    ],
    plugins: pgl([
      resolve(),
      commonjs()
    ]),
    onwarn
  }
];

function onwarn(warning, warn) {

  // TODO(@barmac): remove once https://github.com/moment/luxon/issues/193 is resolved
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    if (warning.message.includes('luxon')) {
      return;
    }
  }

  if (warning.code === 'THIS_IS_UNDEFINED') {
    if (warning.id.includes('flatpickr')) {
      return;
    }
  }

  warn(warning);
}

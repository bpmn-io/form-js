import css from 'rollup-plugin-css-only';

import babel from '@rollup/plugin-babel';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

function pgl(plugins=[]) {
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
    plugins: pgl()
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
    ])
  }
];
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    ...plugins,
    commonjs()
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
    external: [
      'mitt',
      'min-dash',
      'preact',
      'preact/jsx-runtime',
      'preact/hooks',
      'preact/compat',
      'preact-markup',
      'snarkdown'
    ],
    plugins: pgl([
      copy({
        targets: [
          { src: 'assets/form-js.css', dest: 'dist/assets' }
        ]
      })
    ])
  },
  {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'umd',
        file: pkg['umd:main'],
        name: 'FormViewer'
      }
    ],
    plugins: pgl([
      resolve()
    ])
  }
];
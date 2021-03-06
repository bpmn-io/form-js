import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

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
    plugins: [
      babel({
        plugins: [
          [ '@babel/plugin-transform-react-jsx', {
            'importSource': 'preact',
            'runtime': 'automatic'
          } ]
        ]
      }),
      copy({
        targets: [
          { src: 'assets/form-js.css', dest: 'dist/assets' }
        ]
      }),
      resolve({
        resolveOnly: [
          'min-dash',
          'mitt'
        ]
      })
    ]
  }
];
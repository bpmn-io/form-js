import copy from 'rollup-plugin-copy';

import pkg from './package.json';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';


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
      '@bpmn-io/form-js-viewer',
      '@bpmn-io/form-js-editor'
    ],
    plugins: [
      copy({
        targets: [
          { src: 'node_modules/@bpmn-io/form-js-viewer/dist/assets/**/*.css', dest: 'dist/assets' },
          { src: 'node_modules/@bpmn-io/form-js-editor/dist/assets/**/*.css', dest: 'dist/assets' }
        ]
      })
    ]
  },
  {
    input: 'src/editor.js',
    output: [
      {
        format: 'umd',
        file: pkg.exports['./editor'].umd,
        name: 'FormEditor'
      }
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  {
    input: 'src/viewer.js',
    output: [
      {
        format: 'umd',
        file: pkg.exports['./viewer'].umd,
        name: 'FormViewer'
      }
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
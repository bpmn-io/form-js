import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import reactSvg from 'rollup-plugin-react-svg';
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
      alias({
        entries: [
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom', replacement: 'preact/compat' }
        ]
      }),
      reactSvg(),
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
          { src: 'node_modules/@bpmn-io/form-js-viewer/dist/assets/form-js.css', dest: 'dist/assets' },
          { src: 'assets/form-js-editor.css', dest: 'dist/assets' },
          { src: '../../node_modules/dragula/dist/dragula.css', dest: 'dist/assets' }
        ]
      }),
      json(),
      resolve({
        resolveOnly: [
          'min-dash',
          'mitt'
        ]
      })
    ]
  }
];
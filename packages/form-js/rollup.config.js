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
      copy({
        targets: [
          { src: 'node_modules/@bpmn-io/form-js-viewer/dist/assets/form-js.css', dest: 'dist/assets' },
          { src: 'node_modules/@bpmn-io/form-js-editor/dist/assets/form-js-editor.css', dest: 'dist/assets' },
          { src: 'node_modules/@bpmn-io/form-js-editor/dist/assets/dragula.css', dest: 'dist/assets' }
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
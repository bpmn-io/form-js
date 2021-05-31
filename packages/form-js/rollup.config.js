import copy from 'rollup-plugin-copy';

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
  }
];
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import reactSvg from 'rollup-plugin-react-svg';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },

        // we need this to make sure we use the same
        // preact version for the properties panel
        { find: '../preact', replacement: 'preact' },
        { find: '../preact/hooks', replacement: 'preact/hooks' },
        { find: '../preact/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    }),
    resolve({
      resolveOnly: [ 'diagram-js', '@bpmn-io/properties-panel' ]
    }),
    reactSvg(),
    babel({
      babelHelpers: 'bundled',
      plugins: [
        [ '@babel/plugin-transform-react-jsx', {
          'importSource': 'preact',
          'runtime': 'automatic'
        } ]
      ]
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
    external: [
      'ids',
      'min-dash',
      'array-move',
      'big.js',
      'preact',
      'preact/jsx-runtime',
      'preact/hooks',
      'preact/compat',
      'dragula',
      '@bpmn-io/form-js-viewer'
    ],
    plugins: pgl([
      copy({
        targets: [
          { src: 'assets/form-js-editor-base.css', dest: 'dist/assets' }
        ]
      })
    ])
  }
];
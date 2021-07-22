import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import reactSvg from 'rollup-plugin-react-svg';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

function pgl(plugins=[]) {
  return [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' }
      ]
    }),
    resolve({
      resolveOnly: [ 'diagram-js' ]
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
          { src: 'assets/form-js-editor.css', dest: 'dist/assets' },
          { src: '../../node_modules/dragula/dist/dragula.css', dest: 'dist/assets' }
        ]
      })
    ])
  }
];
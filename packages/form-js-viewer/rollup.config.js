import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

function pgl(plugins = []) {

  return [
    resolve({
      resolveOnly: [ 'diagram-js' ]
    }),
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
      'min-dash',
      'preact',
      'preact/jsx-runtime',
      'preact/hooks',
      'preact/compat',
      'preact-markup',
      '@bpmn-io/snarkdown'
    ],
    plugins: pgl([
      copy({
        targets: [
          { src: 'assets/form-js.css', dest: 'dist/assets' }
        ]
      })
    ])
  }
];
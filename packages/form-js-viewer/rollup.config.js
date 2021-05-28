import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';


function pgl(options = {}) {

  const {
    resolve: resolveOptions = {},
    copy: copyOptions
  } = options;

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
    copyOptions && copy(copyOptions),
    resolveOptions && resolve(resolveOptions)
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
    plugins: pgl({
      resolve: {
        resolveOnly: [
          'min-dash',
          'mitt'
        ]
      },
      copy: {
        targets: [
          { src: 'assets/form-js.css', dest: 'dist/assets' }
        ]
      }
    })
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
    plugins: pgl({
      resolve: {}
    })
  }
];
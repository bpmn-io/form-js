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
      'min-dash',
      'big.js',
      'preact',
      'preact/jsx-runtime',
      'preact/hooks',
      'preact/compat',
      'preact-markup',
      'flatpickr',
      'showdown',
      '@carbon/grid',
      'feelers'
    ],
    plugins: pgl([
      copy({
        targets: [
          { src: 'assets/form-js-base.css', dest: 'dist/assets' }
        ]
      })
    ]),

    onwarn(warning, warn) {

      // TODO(@barmac): remove once https://github.com/moment/luxon/issues/193 is resolved
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        if (warning.message.includes('luxon')) {
          return;
        }
      }

      if (warning.code === 'THIS_IS_UNDEFINED') {
        if (warning.id.includes('flatpickr')) {
          return;
        }
      }

      warn(warning);
    }
  }
];
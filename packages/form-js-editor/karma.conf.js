const path = require('path');

const {
  NormalModuleReplacementPlugin
} = require('webpack');

const coverage = process.env.COVERAGE;

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const singleStart = process.env.SINGLE_START;

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

const suite = coverage ? 'test/coverageBundle.js' : 'test/testBundle.js';

module.exports = function(karma) {

  const config = {

    frameworks: [
      'webpack',
      'mocha',
      'sinon-chai'
    ],

    files: [
      suite
    ],

    preprocessors: {
      [ suite ]: [ 'webpack', 'env' ]
    },

    envPreprocessor: [
      'NODE_ENV'
    ],

    reporters: [ 'progress' ].concat(coverage ? 'coverage' : []),

    coverageReporter: {
      reporters: [
        { type: 'lcov', subdir: '.' }
      ]
    },

    browsers,

    singleRun: true,
    autoWatch: false,

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: [ 'source-map-loader' ]
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              'css-loader',
              'sass-loader'
            ],
          },
          {
            test: /\.css$/,
            use: 'raw-loader'
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [
                  [ '@babel/plugin-transform-react-jsx', {
                    'importSource': 'preact',
                    'runtime': 'automatic'
                  } ],
                  '@babel/plugin-transform-react-jsx-source'
                ].concat(
                  coverage ? [
                    [
                      'istanbul', {
                        include: [
                          'src/**'
                        ]
                      }
                    ]
                  ] : []
                )
              }
            }
          },
          {
            test: /\.svg$/,
            use: [ 'react-svg-loader' ]
          }
        ]
      },
      plugins: [
        new NormalModuleReplacementPlugin(
          /^(..\/preact|preact)(\/[^/]+)?$/,
          function(resource) {

            const replMap = {
              'preact/hooks': path.resolve('../../node_modules/preact/hooks/dist/hooks.module.js'),
              'preact/jsx-runtime': path.resolve('../../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js'),
              'preact': path.resolve('../../node_modules/preact/dist/preact.module.js'),
              '../preact/hooks': path.resolve('../../node_modules/preact/hooks/dist/hooks.module.js'),
              '../preact/jsx-runtime': path.resolve('../../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js'),
              '../preact': path.resolve('../../node_modules/preact/dist/preact.module.js')
            };

            const replacement = replMap[resource.request];

            if (!replacement) {
              return;
            }

            resource.request = replacement;
          }
        ),
      ],
      resolve: {
        mainFields: [
          'browser',
          'module',
          'main'
        ],
        modules: [
          'node_modules',
          __dirname
        ],
        alias: {
          'react': 'preact/compat',
          'react-dom': 'preact/compat'
        }
      },
      devtool: 'eval-source-map'
    }
  };

  if (singleStart) {
    config.browsers = [].concat(config.browsers, 'Debug');
    config.envPreprocessor = [].concat(config.envPreprocessor || [], 'SINGLE_START');
  }

  karma.set(config);
};

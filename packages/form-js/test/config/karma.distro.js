// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const VARIANT = process.env.VARIANT;

if (!VARIANT) {
  throw new Error('missing env.VARIANT');
}

var basePath = '../..';

var suite = 'test/distro/' + VARIANT + '.js';

module.exports = function (karma) {
  const config = {
    basePath,

    frameworks: [
      'mocha',
      'webpack',
    ],

    files: [
      `dist/${VARIANT}.umd.js`,
      'dist/assets/form-js.css',
      'dist/assets/form-js-editor.css',
      'dist/assets/form-js-playground.css',
      suite,
    ],

    preprocessors: {
      [ suite ]: [ 'webpack' ]
    },

    reporters: ['spec'],

    specReporter: {
      maxLogLines: 10,
      suppressSummary: true,
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showBrowser: false,
      showSpecTiming: false,
      failFast: false,
    },

    browsers,

    singleRun: true,
    autoWatch: false,

    webpack: {
      mode: 'development',
      devtool: 'eval-source-map',
    },
  };

  karma.set(config);
};

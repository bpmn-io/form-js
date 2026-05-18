// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const variant = process.env.VARIANT;

if (!variant) {
  throw new Error('missing env.VARIANT');
}

// use puppeteer provided Chrome for testing

const suite = `test/distro/${variant}.js`;

module.exports = function (karma) {
  const config = {
    basePath: '../..',

    frameworks: ['webpack', 'mocha'],

    files: [
      `dist/${variant}.umd.js`,
      'dist/assets/form-js.css',
      'dist/assets/form-js-editor.css',
      'dist/assets/form-js-playground.css',
      suite,
    ],

    preprocessors: {
      [suite]: ['webpack'],
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

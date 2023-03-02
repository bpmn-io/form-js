// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const variant = process.env.VARIANT;

if (!variant) {
  throw new Error('missing env.VARIANT');
}

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(karma) {

  const config = {

    basePath: '../../',

    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    files: [
      `dist/${variant}.umd.js`,
      'dist/assets/form-js.css',
      'dist/assets/form-js-editor.css',
      'dist/assets/form-js-playground.css',
      `test/distro/${variant}.js`
    ],

    reporters: [ 'progress' ],

    browsers,

    singleRun: true,
    autoWatch: false
  };

  karma.set(config);
};
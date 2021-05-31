// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

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
      'dist/form-js-editor.umd.js',
      'dist/assets/dragula.css',
      'dist/assets/form-js.css',
      'dist/assets/form-js-editor.css',
      'test/distro/form-editor.js'
    ],

    reporters: [ 'progress' ],

    browsers,

    singleRun: true,
    autoWatch: false
  };

  karma.set(config);
};

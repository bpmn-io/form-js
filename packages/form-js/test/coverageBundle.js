// @ts-ignore-next-line
const allTests = require.context('.', true, /.spec\.js$/);

allTests.keys().forEach(allTests);

// @ts-ignore-next-line
const allSources = require.context('../src', true, /.*\.js$/);

allSources.keys().forEach(allSources);
const allTests = require.context('.', true, /.spec\.js$/);

allTests.keys().forEach(allTests);
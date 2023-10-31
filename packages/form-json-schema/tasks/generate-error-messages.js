const util = require('util');

const readFile = require('fs').readFileSync,
      writeFile = require('fs').writeFileSync,
      mkdir = require('fs').mkdirSync;

const pathJoin = require('path').join,
      dirname = require('path').dirname;

const mri = require('mri');

const argv = process.argv.slice(2);


async function bundleErrors(errorMessages, path) {
  return writeErrors(errorMessages, path);
}


function writeErrors(errorMessages, path) {
  const filePath = pathJoin(path);

  try {
    mkdir(dirname(filePath));
  } catch {

    // directory may already exist
  }

  writeFile(filePath, JSON.stringify(errorMessages, 0, 2));

  return filePath;
}


const {
  input,
  output
} = mri(argv, {
  alias: {
    i: 'input',
    o: 'output'
  }
});

if (!input || !output) {
  console.error('Arguments missing.');
  console.error('Example: node tasks/generate-error-messages.js --input=./src/error-messages.json --output=./resources/error-messages.json');
  process.exit(1);
}

bundleErrors(JSON.parse(readFile(input)), output);


// helper /////////////

// eslint-disable-next-line no-unused-vars
function printNested(object) {
  console.log(util.inspect(object, {
    showHidden: false,
    depth: null,
    colors: true
  }));
}
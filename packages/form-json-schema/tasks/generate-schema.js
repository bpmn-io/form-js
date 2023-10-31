const util = require('util');
const refParser = require('@apidevtools/json-schema-ref-parser');

const readFile = require('fs').readFileSync,
      writeFile = require('fs').writeFileSync,
      mkdir = require('fs').mkdirSync;

const pathJoin = require('path').join,
      dirname = require('path').dirname;

const mri = require('mri');

const argv = process.argv.slice(2);


async function bundleSchema(schema, path) {
  try {
    const plainSchema = await refParser.bundle(schema);
    return writeSchema(plainSchema, path);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


function writeSchema(schema, path) {
  const filePath = pathJoin(path);

  try {
    mkdir(dirname(filePath));
  } catch {

    // directory may already exist
  }

  writeFile(filePath, JSON.stringify(schema, 0, 2));

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
  console.error('Example: node tasks/generate-schema.js --input=./src/schema.json --output=./resources/schema.json');
  process.exit(1);
}

bundleSchema(JSON.parse(readFile(input)), output);


// helper /////////////

// eslint-disable-next-line no-unused-vars
function printNested(object) {
  console.log(util.inspect(object, {
    showHidden: false,
    depth: null,
    colors: true
  }));
}
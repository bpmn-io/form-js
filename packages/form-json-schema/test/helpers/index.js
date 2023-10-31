const {
  forEach,
  set
} = require('min-dash');

const { default: Ajv } = require('ajv');
const AjvErrors = require('ajv-errors');

module.exports = {
  createValidator,
  withErrorMessages
};

function createValidator(schema, errors) {

  const ajv = new Ajv({
    allErrors: true,
    strict: false
  });

  AjvErrors(ajv);

  return ajv.compile(withErrorMessages(schema, errors));
}

function withErrorMessages(schema, errors) {

  if (!errors || !errors.length) {
    return schema;
  }

  // clone a new copy
  let newSchema = JSON.parse(JSON.stringify(schema));

  // set <errorMessage> keyword for given path
  forEach(errors, function(error) {
    newSchema = setErrorMessage(newSchema, error);
  });

  return newSchema;
}

function setErrorMessage(schema, error) {
  const {
    path,
    errorMessage
  } = error;

  const errorMessagePath = [
    ...path,
    'errorMessage'
  ];

  return set(schema, errorMessagePath, errorMessage);
}
const { default: Ajv } = require('ajv');
const { expect } = require('chai');

const schema = require('../../resources/schema.json');

describe('schema validation', function() {

  it('should be valid', function() {

    // given
    const ajv = new Ajv();

    // when
    const valid = ajv.validateSchema(schema);

    // then
    expect(valid).to.be.true;
    expect(valid.errors).to.not.exist;
  });

});
import {
  bootstrapForm,
  getForm,
  inject
} from 'test/TestHelper';

import { clone } from 'src/util';

import schema from '../form.json';


describe('Importer', function() {

  beforeEach(bootstrapForm());

  afterEach(function() {
    getForm().destroy();
  });


  it('should import without errors', inject(async function(form, formFieldRegistry) {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      product: 'camunda-cloud',
      language: 'english'
    };

    // when
    const { err, warnings } = await form.importSchema(schema, data);

    // then
    expect(err).not.to.exist;
    expect(warnings).to.be.empty;

    expect(formFieldRegistry.size).to.equal(11);
  }));


  it('should error if form field of type not supported', inject(async function(form) {

    // given
    const error = clone(schema);

    error.components.push({
      type: 'foo'
    });

    // when
    try {
      await form.importSchema(error);
    } catch (err) {

      // then
      expect(err).to.exist;
      expect(err.message).to.eql('form field of type <foo> not supported');

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));


  it('should error if form field with key already exists', inject(async function(form) {

    // given
    const error = clone(schema);

    error.components.push({
      type: 'textfield',
      key: 'creditor'
    });

    // when
    try {
      await form.importSchema(error);
    } catch (err) {

      // then
      expect(err).to.exist;
      expect(err.message).to.eql('form field with key <creditor> already exists');

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));


  it('should error if broken JSON is imported', inject(async function(form) {

    // when
    try {
      await form.importSchema('foo');
    } catch (err) {

      // then
      expect(err).to.exist;
      expect(err.message).to.equal('form field of type <undefined> not supported');

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));


  // TODO: Catch broken schema errors during import
  it.skip('should error if broken schema is imported', inject(async function(form) {

    // given
    const error = clone(schema);

    error.components.push({
      type: 'select',
      key: 'foo',
      values: 123
    });

    // when
    try {
      await form.importSchema(error);
    } catch (err) {

      // then
      expect(err).to.exist;

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));

});
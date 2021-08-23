import {
  bootstrapForm,
  getForm,
  inject
} from 'test/TestHelper';

import { clone } from 'src/util';

import schema from '../form.json';
import other from '../other.json';


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

    expect(formFieldRegistry.getAll()).to.have.length(11);
  }));


  it('should decode JSON', inject(async function(form, formFieldRegistry) {

    // when
    const { err, warnings } = await form.importSchema(JSON.stringify({
      type: 'default'
    }));

    // then
    expect(err).not.to.exist;
    expect(warnings).to.be.empty;

    expect(formFieldRegistry.getAll()).to.have.length(1);
  }));


  it('should reimport without errors', inject(async function(form, formFieldRegistry) {

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

    let result = await form.importSchema(schema, data);

    // assume
    expect(result.err).not.to.exist;
    expect(result.warnings).to.be.empty;

    expect(formFieldRegistry.getAll()).to.have.length(11);

    // when
    result = await form.importSchema(other, data);

    // then
    expect(result.err).not.to.exist;
    expect(result.warnings).to.be.empty;

    expect(formFieldRegistry.getAll()).to.have.length(5);
  }));


  describe('error handling', function() {

    it('should indicate unsupported field type', inject(async function(form) {

      // given
      const errorSchema = {
        type: 'unknown'
      };

      let error;

      // when
      try {
        await form.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field of type <unknown> not supported');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should indicate duplicate <key>', inject(async function(form) {

      // given
      const errorSchema = {
        type: 'default',
        components: [
          {
            key: 'creditor',
            type: 'text'
          },
          {
            key: 'creditor',
            type: 'text'
          }
        ]
      };

      let error;

      // when
      try {
        await form.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field with key <creditor> already exists');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should indicate duplicate <id>', inject(async function(form) {

      // given
      const errorSchema = {
        type: 'default',
        components: [
          {
            id: 'foo',
            type: 'text'
          },
          {
            id: 'foo',
            type: 'text'
          }
        ]
      };

      let error;

      // when
      try {
        await form.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field with id <foo> already exists');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should handle undefined', inject(async function(form) {

      let error;

      // when
      try {
        await form.importSchema(null);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.equal('must provide <schema>');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should handle broken JSON', inject(async function(form) {

      let error;

      // when
      try {
        await form.importSchema('foo');
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.match(/failed to parse schema: /);

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    // TODO: Catch broken schema errors during import
    it.skip('should error if broken schema is imported', inject(async function(form) {

      // given
      const errorSchema = clone(schema);

      errorSchema.components.push({
        type: 'select',
        key: 'foo',
        values: 123
      });

      let error;

      // when
      try {
        await form.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));

  });

});
import {
  bootstrapForm,
  getForm,
  inject
} from 'test/TestHelper';

import { clone } from 'src/util';

import schema from '../form.json';
import other from '../other.json';
import dynamicSchema from '../dynamic.json';
import defaultValues from '../defaultValues.json';


describe('Importer', function() {

  beforeEach(bootstrapForm());

  afterEach(function() {
    getForm().destroy();
  });


  describe('form fields', function() {

    it('should import without errors', inject(async function(form, formFieldRegistry) {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        language: 'english'
      };

      // when
      const { err, warnings } = await form.importSchema(schema, data);

      // then
      expect(err).not.to.exist;
      expect(warnings).to.be.empty;

      expect(formFieldRegistry.getAll()).to.have.length(16);
    }));


    it('should reimport without errors', inject(async function(form, formFieldRegistry) {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        language: 'english'
      };

      let result = await form.importSchema(schema, data);

      // assume
      expect(result.err).not.to.exist;
      expect(result.warnings).to.be.empty;

      expect(formFieldRegistry.getAll()).to.have.length(16);

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
              type: 'textfield'
            },
            {
              key: 'creditor',
              type: 'textfield'
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


      it('should handle broken JSON', inject(async function(form) {

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


  describe('data', function() {

    it('should import data', inject(async function(form, formFieldRegistry) {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        approverComments: 'Please review C-123',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        language: 'english',
        conversation: '2010-06-06T12:00Z'
      };

      // when
      await form.importSchema(schema, data);

      // then
      expect(form._getState().data).to.eql({
        creditor: 'John Doe Company',
        invoiceNumber: 'C-123',
        amount: 456,
        approved: true,
        approvedBy: 'John Doe',
        approverComments: 'Please review C-123',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        language: 'english',
        conversation: '2010-06-06T12:00Z'
      });
    }));


    it('should import data (empty)', inject(async function(form) {

      // given
      const data = {};

      // when
      await form.importSchema(schema, data);

      // then
      expect(form._getState().data).to.eql({
        creditor: '',
        invoiceNumber: '',
        amount: null,
        approved: false,
        approvedBy: '',
        approverComments: '',
        mailto: [],
        product: null,
        tags: [],
        language: null,
        conversation: null
      });
    }));


    it('should import data (default values)', inject(async function(form) {

      // given
      const data = {};

      // when
      await form.importSchema(defaultValues, data);

      // then
      expect(form._getState().data).to.eql({
        creditor: 'Max Mustermann GmbH',
        invoiceNumber: '',
        amount: 0,
        approved: true,
        approvedBy: '',
        approverComments: 'Sample comment provided by the approver',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-platform',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        language: 'english'
      });
    }));


    it('should import data not defined on the form', inject(async function(form) {

      // given
      const data = { randomExternalDataBool: true, randomExternalDataInt: 9 };

      // when
      await form.importSchema(defaultValues, data);

      // then
      expect(form._getState().data).to.eql({
        randomExternalDataBool: true,
        randomExternalDataInt: 9 ,
        creditor: 'Max Mustermann GmbH',
        invoiceNumber: '',
        amount: 0,
        approved: true,
        approvedBy: '',
        approverComments: 'Sample comment provided by the approver',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-platform',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        language: 'english'
      });
    }));


    it('should sanitize data (static)', inject(async function(form) {

      // given
      const data = {
        mailto: [ 'invalid1', 'invalid2', 'approver' ],
        product: 'invalid',
        tags: [ 'invalid1', 'invalid2', 'invalid3', 'tag1' ],
        language: 'invalid',
        approvedBy: { someInvalidStructure: false },
        approverComments: { someInvalidStructure: true },
      };

      // when
      await form.importSchema(defaultValues, data);

      expect(form._getState().data).to.eql({
        creditor: 'Max Mustermann GmbH',
        invoiceNumber: '',
        amount: 0,
        approved: true,
        approvedBy: '',
        approverComments: '',
        mailto: [ 'approver' ],
        product: null,
        tags: [ 'tag1' ],
        language: null
      });
    }));


    it('should sanitize data (dynamic)', inject(async function(form) {

      // given
      const xyzData = [
        {
          label: 'x',
          value: 'dataX'
        },
        {
          label: 'y',
          value: 'dataY'
        },
        {
          label: 'x',
          value: 'dataZ'
        },
      ];

      const data = {
        mailto: [ 'invalidData1', 'invalidData2', 'invalidData3', 'dataX' ],
        product: 'invalidData',
        tags: [ 'dataX', 'dataY', 'invalidData' ],
        language: 'invalidData',
        xyzData
      };

      // when
      await form.importSchema(dynamicSchema, data);

      expect(form._getState().data).to.eql({
        mailto: [ 'dataX' ],
        product: null,
        tags: [ 'dataX', 'dataY' ],
        language: null,
        xyzData
      });
    }));

  });

});
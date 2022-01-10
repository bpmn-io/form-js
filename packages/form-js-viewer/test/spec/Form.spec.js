import {
  fireEvent,
  screen
} from '@testing-library/preact/pure';

import {
  createForm,
  Form,
  schemaVersion
} from '../../src';

import { spy } from 'sinon';

import customModule from './custom';

import disabledSchema from './disabled.json';
import schema from './form.json';
import schemaNoIds from './form.json';
import textSchema from './text.json';

import {
  insertCSS,
  isSingleStart
} from '../TestHelper';

// @ts-ignore-next-line
import customCSS from './custom/custom.css';

insertCSS('custom.css', customCSS);

const singleStart = isSingleStart('basic');


describe('Form', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
  });


  it('should expose schemaVersion', function() {
    expect(typeof schemaVersion).to.eql('number');
  });


  (singleStart ? it.only : it)('should render', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      product: 'camunda-cloud',
      language: 'english',
      documents: [
        {
          title: 'invoice.pdf',
          author: 'John Doe'
        },
        {
          title: 'products.pdf'
        }
      ]
    };

    // when
    const form = await createForm({
      container,
      data,
      schema
    });

    form.on('changed', event => {
      console.log('Form <changed>', event);
    });

    form.on('submit', event => {
      console.log('Form <submit>', event);
    });

    // then
    expect(form.get('formFieldRegistry').getAll()).to.have.length(11);
  });


  describe('#importSchema', function() {

    it('should import empty schema', async function() {

      // given
      const schema = {
        type: 'default'
      };

      // when
      const form = await createForm({
        container,
        schema
      });

      // then
      expect(form.get('formFieldRegistry').getAll()).to.have.length(1);
    });


    it('should generate IDs', async function() {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        product: 'camunda-cloud',
        language: 'english',
        documents: [
          {
            title: 'invoice.pdf',
            author: 'John Doe'
          },
          {
            title: 'products.pdf'
          }
        ]
      };

      // when
      const form = new Form();

      await form.importSchema(schemaNoIds, data);

      // then
      expect(form.get('formFieldRegistry').getAll()).to.have.length(11);

      form.get('formFieldRegistry').forEach(field => {
        expect(field.id).to.exist;
      });
    });


    it('should import without errors', async function() {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        product: 'camunda-cloud',
        language: 'english',
        documents: [
          {
            title: 'invoice.pdf',
            author: 'John Doe'
          },
          {
            title: 'products.pdf'
          }
        ]
      };

      // when
      const form = new Form();

      await form.importSchema(schema, data);

      // then
      expect(form.get('formFieldRegistry').getAll()).to.have.length(11);
    });


    it('should fail instantiation with import error', async function() {

      // given
      const data = {
        amount: 456
      };

      const schema = {
        type: 'default',
        components: [
          {
            type: 'unknown-component'
          }
        ]
      };

      let error;

      // when
      try {
        await createForm({
          container,
          data,
          schema
        });
      } catch (_error) {
        error = _error;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field of type <unknown-component> not supported');
    });


    it('should fire <*.clear> before import', async function() {

      // given
      const form = new Form();

      const importDoneSpy = spy();

      form.on('import.done', importDoneSpy);

      await form.importSchema(schema);

      // then
      expect(importDoneSpy).to.have.been.calledOnce;
    });


    it('should fire <import.done> after import success', async function() {

      // given
      const form = new Form();

      const importDoneSpy = spy();

      form.on('import.done', importDoneSpy);

      await form.importSchema(schema);

      // then
      expect(importDoneSpy).to.have.been.calledOnce;
    });


    it('should fire <import.done> after import error', async function() {

      // given
      const schema = {
        type: 'default',
        components: [
          {
            type: 'unknown-component'
          }
        ]
      };

      const form = new Form();

      const importDoneSpy = spy();

      form.on('import.done', importDoneSpy);

      try {
        await form.importSchema(schema);
      } catch (err) {

        // then
        expect(importDoneSpy).to.have.been.calledOnce;
        expect(importDoneSpy).to.have.been.calledWithMatch({ error: err, warnings: err.warnings });
      }
    });

  });


  it('should render complex text', async function() {

    // when
    const form = await createForm({
      container,
      schema: textSchema
    });

    // then
    expect(form).to.exist;
  });


  describe('empty', function() {

    it('should render empty', async function() {

      // given
      const data = {};

      // when
      const form = await createForm({
        container,
        data,
        schema
      });

      // then
      expect(form).to.exist;
    });


    it('should submit empty', async function() {

      // given
      const data = {};

      const form = await createForm({
        container,
        data,
        schema
      });

      // when
      const submission = form.submit();

      // then
      expect(submission.data).to.eql({
        creditor: '',
        invoiceNumber: '',
        amount: null,
        approved: false,
        approvedBy: '',
        product: null,
        language: null
      });

      expect(submission.errors).to.eql({
        creditor: [ 'Field is required.' ]
      });
    });

  });


  it('#clear', async function() {

    // given
    const form = await createForm({
      container,
      schema
    });

    const diagramClearSpy = spy(),
          formClearSpy = spy();

    form.on('diagram.clear', diagramClearSpy);
    form.on('form.clear', formClearSpy);

    // when
    form.clear();

    // then
    expect(container.childNodes).not.to.be.empty;

    expect(diagramClearSpy).to.have.been.calledOnce;
    expect(formClearSpy).to.have.been.calledOnce;

    expect(form.get('formFieldRegistry').getAll()).to.be.empty;
  });


  it('#destroy', async function() {

    // given
    const form = await createForm({
      container,
      schema
    });

    const diagramDestroySpy = spy(),
          formDestroySpy = spy();

    form.on('diagram.destroy', diagramDestroySpy);
    form.on('form.destroy', formDestroySpy);

    // when
    form.destroy();

    // then
    expect(container.childNodes).to.be.empty;

    expect(diagramDestroySpy).to.have.been.calledOnce;
    expect(formDestroySpy).to.have.been.calledOnce;
  });


  it('#validate', async function() {

    // given
    const form = await createForm({
      container,
      schema
    });

    // when
    const errors = form.validate();

    // then
    expect(errors).to.eql({
      creditor: [
        'Field is required.'
      ]
    });
  });


  it('#on', async function() {

    // given
    const form = await createForm({
      container,
      schema
    });

    const fooSpy = spy();

    // when
    form.on('foo', fooSpy);

    form._emit('foo');

    // then
    expect(fooSpy).to.have.been.calledOnce;
  });


  it('#off', async function() {

    // given
    const form = await createForm({
      container,
      schema
    });

    const fooSpy = spy();

    form.on('foo', fooSpy);

    form._emit('foo');

    // when
    form.off('foo', fooSpy);

    form._emit('foo');

    // then
    expect(fooSpy).to.have.been.calledOnce;
  });


  it('should throw error on submit if disabled', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = await createForm({
      container,
      data,
      schema,
      properties: {
        readOnly: true
      }
    });

    // when
    let error;

    try {
      form.submit();
    } catch (_error) {
      error = _error;
    }

    // then
    expect(error).to.exist;
    expect(error.message).to.eql('form is read-only');
  });


  it('should not submit disabled fields', async function() {

    // given
    const data = {
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = await createForm({
      container,
      data,
      schema: disabledSchema
    });

    // when
    const submission = form.submit();

    // then
    expect(submission.data).not.to.have.property('creditor');
    expect(submission.errors).not.to.have.property('creditor');
  });


  it('should not submit data without corresponding field', async function() {

    // given
    const data = {
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      foo: 'bar'
    };

    // when
    const form = await createForm({
      container,
      data,
      schema: disabledSchema
    });

    // when
    const submission = form.submit();

    // then
    expect(submission.data).not.to.have.property('foo');
    expect(submission.errors).not.to.have.property('foo');
  });


  it('should not validate disabled fields', async function() {

    // given
    const data = {
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = await createForm({
      container,
      data,
      schema: disabledSchema
    });

    // when
    const errors = form.validate();

    // then
    expect(errors).not.to.have.property('creditor');
  });


  it('should attach', async function() {

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
    const form = await createForm({
      data,
      schema
    });

    // assume
    expect(form._container.parentNode).not.to.exist;

    // when
    form.attachTo(container);

    // then
    expect(form._container.parentNode).to.exist;
  });


  it('should detach', async function() {

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
    const form = await createForm({
      container,
      data,
      schema
    });

    // assume
    expect(form._container.parentNode).to.exist;

    // when
    form.detach();

    // then
    expect(form._container.parentNode).not.to.exist;
  });


  it('should be customizable', async function() {

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
    await createForm({
      container,
      data,
      schema,
      additionalModules: [
        customModule
      ]
    });

    // then
    expect(document.querySelector('.custom-button')).to.exist;
  });


  it('should update, reset and submit', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = await createForm({
      container,
      data,
      schema
    });

    const field = getFormField(form, 'creditor');

    // update programmatically
    form._update({
      field,
      value: 'Jane Doe Company'
    });

    // when submit
    const submission = form.submit();

    // then
    expect(submission.data).to.eql({
      creditor: 'Jane Doe Company',
      invoiceNumber: 'C-123',
      amount: 456,
      approved: true,
      approvedBy: 'John Doe',
      product: null,
      language: null
    });

    expect(submission.errors).to.be.empty;

    // when reset
    form.reset();

    // then
    const state = form._getState();

    expect(state.data).to.eql({
      creditor: 'John Doe Company',
      invoiceNumber: 'C-123',
      amount: 456,
      approved: true,
      approvedBy: 'John Doe',
      product: null,
      language: null
    });

    expect(state.errors).to.be.empty;
  });


  it('should reset (no data)', async function() {

    // when
    const form = await createForm({
      container,
      schema
    });

    // update programmatically
    form._update({
      field: getFormField(form, 'creditor'),
      value: 'Jane Doe Company'
    });

    form._update({
      field: getFormField(form, 'amount'),
      value: '123'
    });

    form._update({
      field: getFormField(form, 'approved'),
      value: true
    });

    // when
    form.reset();

    // then
    const state = form._getState();

    expect(state.data).to.eql({
      creditor: '',
      invoiceNumber: '',
      amount: null,
      approved: false,
      approvedBy: '',
      product: null,
      language: null
    });

    expect(state.errors).to.be.empty;
  });


  it('should emit <changed>', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    const form = await createForm({
      container,
      data,
      schema
    });

    const changedListener = spy(function(event) {

      expect(event.data).to.exist;
      expect(event.errors).to.exist;
      expect(event.properties).to.exist;
      expect(event.schema).to.exist;

      expect(event.data.creditor).to.eql('Jane Doe Company');
    });

    form.on('changed', changedListener);

    // when
    const field = getFormField(form, 'creditor');

    form._update({
      field,
      value: 'Jane Doe Company'
    });

    // then
    expect(changedListener).to.have.been.calledOnce;
  });


  it('should emit <submit>', async function() {

    // given
    const data = {
      amount: 456
    };

    const form = await createForm({
      container,
      data,
      schema
    });

    const submitListener = spy(function(event) {

      expect(event.data).to.exist;
      expect(event.errors).to.exist;

      expect(event.data).to.eql({
        creditor: '',
        invoiceNumber: '',
        amount: 456,
        approved: false,
        approvedBy: '',
        product: null,
        language: null
      });

      expect(event.errors).to.eql({
        creditor: [ 'Field is required.' ]
      });
    });

    form.on('submit', submitListener);

    // when
    form.submit();
  });


  describe('validation', function() {

    it('should display error if required field empty', async function() {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        product: 'camunda-cloud',
        language: 'english',
        documents: [
          {
            title: 'invoice.pdf',
            author: 'John Doe'
          },
          {
            title: 'products.pdf'
          }
        ]
      };

      await createForm({
        container,
        data,
        schema
      });

      // when
      const input = await screen.getByLabelText('Creditor*');

      fireEvent.input(input, { target: { value: '' } });

      // then
      expect(screen.getByText('Field is required.')).to.exist;
    });


    it('should display error if required field does not match pattern', async function() {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        product: 'camunda-cloud',
        language: 'english',
        documents: [
          {
            title: 'invoice.pdf',
            author: 'John Doe'
          },
          {
            title: 'products.pdf'
          }
        ]
      };

      await createForm({
        container,
        data,
        schema
      });

      // when
      const input = await screen.getByLabelText('Invoice Number');

      fireEvent.input(input, { target: { value: 'foo' } });

      // then
      expect(screen.getByText('Field must match pattern ^C-[0-9]+$.')).to.exist;
    });

  });

});

// helpers //////////

function getFormField(form, key) {
  return form.get('formFieldRegistry').getAll().find((formField) => formField.key === key);
}
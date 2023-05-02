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

import conditionSchema from './condition.json';
import hiddenFieldsConditionalSchema from './hidden-fields-conditional.json';
import hiddenFieldsExpressionSchema from './hidden-fields-expression.json';
import disabledSchema from './disabled.json';
import schema from './form.json';
import schemaNoIds from './form.json';
import textSchema from './text.json';
import textTemplateSchema from './text-template.json';
import stress from './stress.json';
import rowsSchema from './rows.json';

import {
  insertCSS,
  insertTheme,
  isSingleStart,
} from '../TestHelper';

// @ts-ignore-next-line
import customCSS from './custom/custom.css';

insertCSS('custom.css', customCSS);

const singleStartBasic = isSingleStart('basic');
const singleStartStress = isSingleStart('stress');
const singleStartRows = isSingleStart('rows');
const singleStartTheme = isSingleStart('theme');
const singleStart = singleStartBasic || singleStartStress || singleStartRows || singleStartTheme;


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


  (singleStartBasic ? it.only : it)('should render', async function() {

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
    expect(form.get('formFieldRegistry').getAll()).to.have.length(16);
  });


  (singleStartStress ? it.only : it)('should render stress test', async function() {

    const array = [ ...Array(4000).keys() ];
    const largeDataset = array.map(x => ({ value: `value:${x}`, label: `label:${x}` }));

    // given
    const data = {
      largeDataset
    };

    // when
    const form = await createForm({
      container,
      schema: stress,
      data
    });

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form._update).to.exist;
  });


  (singleStartTheme ? it.only : it)('should render theme', async function() {

    // given
    container.classList.add('cds--g100');
    insertTheme();

    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      tags: [ 'tag1', 'tag2', 'tag3' ],
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

    // then
    expect(form.get('formFieldRegistry').getAll()).to.have.length(16);
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
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
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
      expect(form.get('formFieldRegistry').getAll()).to.have.length(16);

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
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1','tag2', 'tag3' ],
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
      expect(form.get('formFieldRegistry').getAll()).to.have.length(16);
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


  it('should render templated text', async function() {

    // given
    const data = {
      users: [
        {
          name: 'John',
          age: 25,
          twitter: 'JohnCena',
          skills: [
            'JavaScript',
            'HTML',
            'CSS'
          ]
        },
        {
          name: 'Jane',
          age: 30,
          twitter:' KermitTheFrog',
          skills: [
            'C#',
            'Kotlin',
            'Java'
          ]
        },
        {
          name: 'Bob',
          age: 35,
          twitter: 'bobdylan',
          skills:[
            'Rust',
            'F#',
            'Fortran'
          ]
        }
      ],
      currencySymbol: '$'
    };

    // when
    const form = await createForm({
      container,
      schema: textTemplateSchema,
      data
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
        approverComments: '',
        mailto: [],
        product: null,
        tags: [],
        language: null,
        conversation: null
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
        disabled: true
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


  it('should throw error on submit if readonly', async function() {

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
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      tags: [ 'tag1', 'tag2', 'tag3' ],
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
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      tags: [ 'tag1', 'tag2', 'tag3' ],
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
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      tags: [ 'tag1', 'tag2', 'tag3' ],
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
      approvedBy: 'John Doe',
      approverComments: 'Please review by June',
      product: 'camunda-platform',
      tags: [ 'tag1', 'tag2', 'tag3' ],
      language: 'german',
      conversation: '2010-06-15T12:00Z'
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
      approverComments: 'Please review by June',
      mailto: [],
      product: 'camunda-platform',
      tags: [ 'tag1', 'tag2', 'tag3' ],
      language: 'german',
      conversation: '2010-06-15T12:00Z'
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
      approverComments: 'Please review by June',
      mailto: [],
      product: 'camunda-platform',
      tags: [ 'tag1', 'tag2', 'tag3' ],
      language: 'german',
      conversation: '2010-06-15T12:00Z'
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
      approverComments: '',
      mailto: [],
      product: null,
      tags: [],
      language: null,
      conversation: null
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
        approverComments: '',
        mailto: [],
        product: null,
        tags: [],
        language: null,
        conversation: null
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
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
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
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        tags: [ 'tag1', 'tag2', 'tag3' ],
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


  describe('#submit', function() {

    it('should submit fields for which condition is met (form variable)', async function() {

      // given
      const initialData = {
        amount: 456,
        text: 'value'
      };

      const form = await createForm({
        container,
        data: initialData,
        schema: conditionSchema
      });

      // when
      const { data } = form.submit();

      // then
      expect(data).to.have.property('text', 'value');
    });


    it('should submit fields for which condition is met (external variable)', async function() {

      // given
      const schema = {
        ...conditionSchema,
        components: [
          conditionSchema.components[0],
          {
            ...conditionSchema.components[1],
            conditional: {
              hide: '=externalVariable'
            }
          }
        ]
      };
      const initialData = {
        externalVariable: false,
        text: 'value'
      };

      const form = await createForm({
        container,
        data: initialData,
        schema
      });

      // when
      const { data } = form.submit();

      // then
      expect(data).to.have.property('text', 'value');
    });


    it('should NOT submit fields for which condition is NOT met', async function() {

      // given
      const initialData = {
        amount: 0,
        text: 'value'
      };

      const form = await createForm({
        container,
        data: initialData,
        schema: conditionSchema
      });

      // when
      const { data } = form.submit();

      // then
      expect(data).not.to.have.property('text', 'value');
    });


    it('should NOT submit fields for which condition is NOT met (external variable)', async function() {

      // given
      const schema = {
        ...conditionSchema,
        components: [
          conditionSchema.components[0],
          {
            ...conditionSchema.components[1],
            conditional: {
              hide: '=externalVariable'
            }
          }
        ]
      };
      const initialData = {
        externalVariable: true,
        text: 'value'
      };

      const form = await createForm({
        container,
        data: initialData,
        schema
      });

      // when
      const { data } = form.submit();

      // then
      expect(data).not.to.have.property('text');
    });

  });


  describe('integration - hidden fields', function() {

    it('should not affect other fields (conditional)', async function() {

      // given
      await createForm({
        container,
        schema: hiddenFieldsConditionalSchema
      });

      // assume
      expect(getText(container)).to.exist;

      // when
      const inputB = screen.getByLabelText('b');
      fireEvent.change(inputB, { target: { checked: true } });

      const inputC = screen.getByLabelText('c');
      fireEvent.change(inputC, { target: { checked: true } });

      // then
      expect(getText(container)).to.not.exist;

      // but when
      const inputA = screen.getByLabelText('a');
      fireEvent.change(inputA, { target: { checked: true } });

      // then
      expect(getText(container)).to.exist;
    });


    it('should not affect other fields (conditional, external)', async function() {

      // given
      const initialData = {
        c: true
      };

      await createForm({
        container,
        data: initialData,
        schema: hiddenFieldsConditionalSchema
      });

      // assume
      expect(getText(container)).to.exist;

      // when
      const inputB = screen.getByLabelText('b');
      fireEvent.change(inputB, { target: { checked: true } });

      const inputC = screen.getByLabelText('c');
      fireEvent.change(inputC, { target: { checked: true } });

      // then
      expect(getText(container)).to.not.exist;

      // but when
      const inputA = screen.getByLabelText('a');
      fireEvent.change(inputA, { target: { checked: true } });

      // then
      // text is still not visible because of initial data
      expect(getText(container)).to.not.exist;
    });


    it('should not affect other fields (expression)', async function() {

      // given
      await createForm({
        container,
        schema: hiddenFieldsExpressionSchema
      });

      // assume
      expect(getImage(container).alt).to.eql('');

      // when
      const inputB = screen.getByLabelText('b');
      fireEvent.input(inputB, { target: { value: 'foo' } });

      const inputC = screen.getByLabelText('c');
      fireEvent.input(inputC, { target: { value: 'bar' } });

      // then
      expect(getImage(container).alt).to.eql('foobar');

      // but when
      const inputA = screen.getByLabelText('a');
      fireEvent.change(inputA, { target: { checked: true } });

      // then
      expect(getImage(container).alt).to.eql('foo');
    });


    it('should not affect other fields (expression, external)', async function() {

      // given
      const initialData = {
        c: 'external'
      };

      await createForm({
        container,
        data: initialData,
        schema: hiddenFieldsExpressionSchema
      });

      // assume
      expect(getImage(container).alt).to.eql('external');

      // when
      const inputB = screen.getByLabelText('b');
      fireEvent.input(inputB, { target: { value: 'foo' } });

      const inputC = screen.getByLabelText('c');
      fireEvent.input(inputC, { target: { value: 'bar' } });

      // then
      expect(getImage(container).alt).to.eql('foobar');

      // but when
      const inputA = screen.getByLabelText('a');
      fireEvent.change(inputA, { target: { checked: true } });

      // then
      expect(getImage(container).alt).to.eql('fooexternal');
    });

  });


  describe('integration - layout', function() {

    (singleStartRows ? it.only : it)('should render grid', async function() {

      // given
      const data = {};

      await createForm({
        container,
        data,
        schema: rowsSchema
      });

      const order = getLayoutOrder(container);

      // then
      expect(order).to.eql([
        'Invoice Number',
        'Amount',
        'Approved by',
        'Approved',
        'Approver comments'
      ]);
    });


    it('should import rows', async function() {

      // given
      const data = {};

      const form = await createForm({
        container,
        data,
        schema: rowsSchema
      });

      const importedSchema = form._getState().schema;

      const rows = form.get('formLayouter').getRows(importedSchema.id);

      // then
      expect(rows).to.eql([
        {
          id: 'Row_1',
          components: [ 'Textfield_1', 'Number_1' ]
        },
        {
          id: 'Row_2',
          components: [ 'Textfield_2', 'Checkbox_1' ]
        },
        {
          id: 'Row_3',
          components: [ 'Textarea_1' ]
        }
      ]);
    });

  });

});

// helpers //////////

function getFormField(form, key) {
  return form.get('formFieldRegistry').getAll().find((formField) => formField.key === key);
}

function getText(container) {
  return container.querySelector('.fjs-form-field-text');
}

function getImage(container) {
  return container.querySelector('.fjs-image');
}

function getLayoutOrder(container) {
  const grid = container.querySelector('.fjs-vertical-layout');
  const rows = grid.querySelectorAll('.fjs-layout-row');

  let layoutOrder = [];

  rows.forEach(rowNode => {
    const columns = rowNode.querySelectorAll('.fjs-layout-column');

    columns.forEach(columnNode => {
      layoutOrder.push(columnNode.querySelector('.fjs-form-field-label').innerText);
    });
  });

  return layoutOrder;
}
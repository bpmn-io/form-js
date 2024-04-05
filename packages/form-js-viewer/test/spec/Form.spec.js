import {
  act,
  fireEvent,
  screen
} from '@testing-library/preact/pure';

import {
  createForm,
  Form,
  schemaVersion
} from '../../src';

import { spy } from 'sinon';

import { CustomFormFieldsModule } from './custom';

import conditionSchema from './condition.json';
import conditionErrorsSchema from './condition-errors.json';
import conditionErrorsDynamicListSchema from './condition-errors-dynamic-list.json';
import dynamicListVariablesSchema from './dynamic-list-variables.json';
import dynamicListTableFilterInteractionSchema from './dynamic-list-table-filter-interaction.json';
import hiddenFieldsConditionalSchema from './hidden-fields-conditional.json';
import hiddenFieldsExpressionSchema from './hidden-fields-expression.json';
import disabledSchema from './disabled.json';
import requiredSchema from './required.json';
import schema from './form.json';
import groupsSchema from './groups.json';
import schemaNoIds from './form.json';
import textSchema from './text.json';
import textTemplateSchema from './text-template.json';
import stress from './stress.json';
import rowsSchema from './rows.json';
import focusables from './focusables.json';
import customFieldSchema from './customField.json';

import {
  insertCSS,
  insertTheme,
  isSingleStart,
  countComponents
} from '../TestHelper';

import customCSS from './custom/custom.css';

insertCSS('custom.css', customCSS);

const singleStartBasic = isSingleStart('basic');
const singleStartGroups = isSingleStart('groups');
const singleStartStress = isSingleStart('stress');
const singleStartRows = isSingleStart('rows');
const singleStartTheme = isSingleStart('theme');
const singleStartNoTheme = isSingleStart('no-theme');
const singleStartCustom = isSingleStart('custom');
const singleStart =
  singleStartBasic ||
  singleStartGroups ||
  singleStartStress ||
  singleStartRows ||
  singleStartTheme ||
  singleStartNoTheme ||
  singleStartCustom;

describe('Form', function() {

  let container, form;

  const bootstrapForm = ({ bootstrapExecute = () => {}, ...options }) => {
    return act(async () => {
      form = await createForm({ debounce: false, ...options });
      bootstrapExecute(form);
    });
  };

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
    form && form.destroy();
    form = null;
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
    await bootstrapForm({
      container,
      data,
      schema
    });

    form.on('changed', event => {
      singleStartBasic && console.log('Form <changed>', event);
    });

    form.on('submit', event => {
      singleStartBasic && console.log('Form <submit>', event);
    });

    // then
    expect(form.get('formFieldRegistry').getAll()).to.have.length(countComponents(schema));
  });


  (singleStartGroups ? it.only : it)('should render groups', async function() {

    // given
    const data = {};

    // when
    await bootstrapForm({
      container,
      data,
      schema: groupsSchema
    });

    // then
    expect(form.get('formFieldRegistry').getAll()).to.have.length(17);
  });


  (singleStartStress ? it.only : it)('should render stress test', async function() {

    const array = [ ...Array(4000).keys() ];
    const largeDataset = array.map(x => ({ value: `value:${x}`, label: `label:${x}` }));

    // given
    const data = {
      largeDataset
    };

    // when
    await bootstrapForm({
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
    await bootstrapForm({
      container,
      data,
      schema
    });

    // then
    expect(form.get('formFieldRegistry').getAll()).to.have.length(countComponents(schema));
  });


  (singleStartNoTheme ? it.only : it)('should render with no theme', async function() {

    // given
    container.classList.add('cds--g10');
    container.style.backgroundColor = 'white';
    insertTheme();

    await bootstrapForm({
      container,
      schema,
      keyboard: {
        bindTo: document
      }
    });

    // when
    container.querySelector('.fjs-container').classList.add('fjs-no-theme');

    // then
    expect(form.get('formFieldRegistry').getAll()).to.have.length(countComponents(schema));
  });


  describe('#importSchema', function() {

    it('should import empty schema', async function() {

      // given
      const schema = {
        type: 'default'
      };

      // when
      await bootstrapForm({
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
      expect(form.get('formFieldRegistry').getAll()).to.have.length(countComponents(schemaNoIds));

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
      expect(form.get('formFieldRegistry').getAll()).to.have.length(countComponents(schema));
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
        await bootstrapForm({
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
    await bootstrapForm({
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
    await bootstrapForm({
      container,
      schema: textTemplateSchema,
      data
    });

    // then
    expect(form).to.exist;

  });


  it('should properly pass local context to dynamic list elements', async function() {

    // given
    const data = {
      list: [
        {
          key: 1
        },
        {
          key: 2
        }
      ]
    };

    // when
    await bootstrapForm({
      container,
      data,
      schema: dynamicListVariablesSchema
    });

    // then
    expect(form).to.exist;

    const repeatRowContainers = container.querySelectorAll('.fjs-repeat-row-container');
    expect(repeatRowContainers).to.have.length(2);

    repeatRowContainers.forEach((repeatRowContainer, index) => {
      const textInput = repeatRowContainer.querySelector('.fjs-form-field-text p');
      expect(textInput.textContent).to.eql(data.list[index].key.toString());
    });

  });


  it('should hold proper interaction between table and dynamic list', async function() {

    // given
    const data = {
      'onlyShowRiskAbove': 6,
      'riskEntries': [
        {
          'risk': 3,
          'name': 'Alice Johnson',
          'date': '2023-03-01'
        },
        {
          'risk': 6,
          'name': 'Bob Smith',
          'date': '2023-03-05'
        },
        {
          'risk': 9,
          'name': 'Carla Gomez',
          'date': '2023-03-10'
        },
        {
          'risk': 12,
          'name': 'David Lee',
          'date': '2023-03-15'
        }
      ]
    };

    // when
    await bootstrapForm({
      container,
      data,
      schema: dynamicListTableFilterInteractionSchema
    });

    // then
    expect(form).to.exist;

    const table = container.querySelector('.fjs-form-field-table');
    expect(table).to.exist;

    const tableEntries = table.querySelectorAll('.fjs-table-td');
    expect(tableEntries).to.have.length(6);
    expect([ ...tableEntries ].map(e => e.textContent)).to.eql([
      '9', 'Carla Gomez', '2023-03-10',
      '12', 'David Lee', '2023-03-15'
    ]);

    const groups = container.querySelectorAll('.fjs-form-field-group');
    expect(groups).to.have.length(2);

  });


  it('should not trigger required validation on initial load', async function() {

    // given
    const data = {};

    // when
    await bootstrapForm({
      container,
      data,
      schema: requiredSchema
    });

    // then
    expect(form).to.exist;
    expect(document.body.innerHTML).not.to.contain('Field is required.');

  });

  const runFocusBlurTest = function(id, index, selector) {

    it('focus and blur events should trigger for ' + id, async function() {

      // given

      let form;

      await act(async () => {

        await bootstrapForm({
          container,
          schema: focusables,
          bootstrapExecute: (f) => form = f,
          data: {
            taglist: [ 'value1', 'value2' ]
          }
        });

      });

      const focusSpy = spy();
      const blurSpy = spy();

      form.on('formField.focus', focusSpy);
      form.on('formField.blur', blurSpy);

      const formField = form.get('formFieldRegistry').get(id);
      const elements = container.querySelector('.fjs-element').querySelectorAll('.fjs-element');
      const element = elements[index];
      const focusTarget = element.querySelector(selector);

      // when
      await act(() => {
        fireEvent.focus(focusTarget);
        fireEvent.blur(focusTarget);
      });

      // then
      expect(focusSpy).to.have.been.calledWithMatch({ formField });
      expect(blurSpy).to.have.been.calledWithMatch({ formField });

    });

  };

  runFocusBlurTest('number', 0, 'input');

  runFocusBlurTest('date', 1, 'input');

  runFocusBlurTest('time', 2, 'input');

  runFocusBlurTest('datetime', 3, 'input');

  runFocusBlurTest('textfield', 4, 'input');

  runFocusBlurTest('textarea', 5, 'textarea');

  runFocusBlurTest('checkbox', 6, 'input');

  runFocusBlurTest('checklist', 7, 'input');

  runFocusBlurTest('radio', 8, 'input');

  runFocusBlurTest('select', 9, 'input');

  runFocusBlurTest('searchableselect', 10, 'input');

  runFocusBlurTest('taglist', 11, 'input');


  describe('empty', function() {

    it('should render empty', async function() {

      // given
      const data = {};

      // when
      await bootstrapForm({
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

      await bootstrapForm({
        container,
        data,
        schema
      });

      // when
      const submission = form.submit();

      // then
      expect(submission.data).to.deep.include({
        invoiceDetails: {
          supplementaryInfo1: '',
          supplementaryInfo2: ''
        },
        clients: [
          {
            clientSurname: '',
            clientName: ''
          },
          {
            clientSurname: '',
            clientName: ''
          }
        ],
        creditor: '',
        invoiceNumber: '',
        amount: null,
        approved: false,
        approvedBy: '',
        approverComments: '',
        product: null,
        mailto: [],
        language: null,
        conversation: null,
        tags: []
      });

      expect(submission.errors).to.eql({
        Creditor_ID: [ 'Field is required.' ]
      });
    });

  });


  it('#clear', async function() {

    // given
    await bootstrapForm({
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
    await bootstrapForm({
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


  describe('#validate', function() {

    it('should add errors', async function() {

      // given
      await bootstrapForm({
        container,
        schema
      });

      // when
      const errors = form.validate();

      // then
      expect(errors).to.eql({
        Creditor_ID: [
          'Field is required.'
        ]
      });
    });


    it('should NOT add errors for hidden fields', async function() {

      // given
      const initialData = {
        checkbox_4u82gk: true
      };

      await bootstrapForm({
        container,
        data: initialData,
        schema: conditionErrorsSchema
      });

      // when
      const errors = form.validate();

      // then
      expect(errors).to.be.empty;
    });


    it('should NOT add errors for hidden dynamic list elements', async function() {

      // given
      const initialData = {
        hideList: false,
        list: [
          {
            element: null,
            hideElement: true
          },
          {
            element: null,
            hideElement: false
          },
        ]
      };

      await bootstrapForm({
        container,
        data: initialData,
        schema: conditionErrorsDynamicListSchema
      });

      // when
      const errors = form.validate();

      // then
      expect(errors['Element_x'][0]).to.be.undefined;
      expect(errors['Element_x'][1]).to.not.be.empty;
    });


    it('should NOT add errors for fully hidden dynamic list', async function() {

      // given
      const initialData = {
        hideList: true,
        list: [
          {
            element: null,
            hideElement: true
          },
          {
            element: null,
            hideElement: false
          },
        ]
      };

      await bootstrapForm({
        container,
        data: initialData,
        schema: conditionErrorsDynamicListSchema
      });

      // when
      const errors = form.validate();

      // then
      expect(errors).to.be.empty;
    });

  });


  it('#on', async function() {

    // given
    await bootstrapForm({
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
    await bootstrapForm({
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
    await bootstrapForm({
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
    await bootstrapForm({
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
    await bootstrapForm({
      container,
      data,
      schema: disabledSchema
    });

    // when
    const submission = form.submit();

    // then
    expect(submission.data).not.to.have.property('creditor');
    expect(submission.errors).not.to.have.property('Creditor_ID');
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
    await bootstrapForm({
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
    await bootstrapForm({
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
    await bootstrapForm({
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
    await bootstrapForm({
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


  (singleStartCustom ? it.only : it)('should be customizable', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 25
    };

    // when
    await bootstrapForm({
      container,
      data,
      schema: customFieldSchema,
      additionalModules: [
        CustomFormFieldsModule
      ]
    });

    form.on('changed', event => {
      console.log('Form <changed>', event);
    });

    // then
    expect(document.querySelector('.custom-button')).to.exist;
    expect(document.querySelector('.fjs-form-field-range')).to.exist;
  });


  it('should update, reset and submit', async function() {

    // given
    const data = {
      invoiceDetails: {
        supplementaryInfo1: 'Something cool',
        supplementaryInfo2: 'Something even cooler'
      },
      clients: [
        {
          clientSurname: 'James',
          clientName: 'Avenue'
        }
      ],
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
    await bootstrapForm({
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
    expect(submission.data).to.deep.include({ ...data, creditor: 'Jane Doe Company' });
    expect(submission.errors).to.be.empty;

    // when reset
    form.reset();

    // then
    const state = form._getState();

    expect(state.data).to.deep.include(data);
    expect(state.errors).to.be.empty;
  });


  it('should reset (no data)', async function() {

    // when
    await bootstrapForm({
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

    expect(state.data).to.deep.include({
      invoiceDetails: {
        supplementaryInfo1: '',
        supplementaryInfo2: ''
      },
      clients: [
        {
          clientSurname: '',
          clientName: ''
        },
        {
          clientSurname: '',
          clientName: ''
        }
      ],
      creditor: '',
      invoiceNumber: '',
      amount: null,
      approved: false,
      approvedBy: '',
      approverComments: '',
      product: null,
      mailto: [],
      language: null,
      conversation: null,
      tags: []
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

    await bootstrapForm({
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

    await bootstrapForm({
      container,
      data,
      schema
    });

    const submitListener = spy(function(event) {

      expect(event.data).to.exist;
      expect(event.errors).to.exist;

      expect(event.data).to.deep.include({
        invoiceDetails: {
          supplementaryInfo1: '',
          supplementaryInfo2: ''
        },
        clients: [
          {
            clientSurname: '',
            clientName: ''
          },
          {
            clientSurname: '',
            clientName: ''
          }
        ],
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
        Creditor_ID: [ 'Field is required.' ]
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

      await bootstrapForm({
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

      await bootstrapForm({
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

      await bootstrapForm({
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

      await bootstrapForm({
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

      await bootstrapForm({
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

      await bootstrapForm({
        container,
        data: initialData,
        schema
      });

      // when
      const { data } = form.submit();

      // then
      expect(data).not.to.have.property('text');
    });


    it('should NOT submit errors for hidden fields', async function() {

      // given
      const initialData = {
        checkbox_4u82gk: true
      };

      await bootstrapForm({
        container,
        data: initialData,
        schema: conditionErrorsSchema
      });

      // when
      const { errors } = form.submit();
      const { errors: stateErrors } = form._getState();

      // then
      expect(errors).to.not.have.property('Field_17uk1c9');
      expect(stateErrors).to.not.have.property('Field_17uk1c9');
    });

  });


  describe('integration - hidden fields', function() {

    it('should not affect other fields (conditional)', async function() {

      // given
      await bootstrapForm({
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

      await bootstrapForm({
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
      await bootstrapForm({
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

      await bootstrapForm({
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

      await bootstrapForm({
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

      await bootstrapForm({
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
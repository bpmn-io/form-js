import {
  fireEvent,
  render,
  screen
} from '@testing-library/preact/pure';

import { query as domQuery } from 'min-dom';

import PropertiesPanel from '../../../../src/features/properties-panel/PropertiesPanel';
import { VALUES_SOURCES, VALUES_SOURCES_DEFAULTS } from '@bpmn-io/form-js-viewer';
import { removeKey } from '../../../../src/features/properties-panel/groups/CustomValuesGroup';

import {
  EventBus as eventBusMock,
  FormEditor as formEditorMock,
  FormLayoutValidator as formLayoutValidatorMock,
  Selection as selectionMock,
  Modeling as modelingMock,
  Templating as templatingMock,
  WithFormEditorContext
} from './helper';

import schema from '../../form.json';
import defaultValuesSchema from '../../defaultValues.json';
import redundantValuesSchema from '../../redundantValues.json';

import { insertStyles, setEditorValue } from '../../../TestHelper';

import { EMPTY_OPTION } from '../../../../src/features/properties-panel/entries/DefaultValueEntry';

insertStyles();

const spy = sinon.spy;


describe('properties panel', function() {

  let parent,
      container;

  beforeEach(function() {
    parent = document.createElement('div');

    parent.classList.add('fjs-container', 'fjs-editor-container');

    container = document.createElement('div');

    container.classList.add('fjs-properties-container');

    container.style.position = 'absolute';
    container.style.right = '0';

    parent.appendChild(container);

    document.body.appendChild(parent);
  });

  afterEach(function() {
    document.body.removeChild(parent);
  });


  it('should render (no field)', async function() {

    // given
    const result = createPropertiesPanel({ container, schema: null });

    // then
    const placeholder = result.container.querySelector('.bio-properties-panel-placeholder');
    const text = placeholder.querySelector('.bio-properties-panel-placeholder-text');

    expect(placeholder).to.exist;
    expect(text.innerText).to.eql('Select a form field to edit its properties.');
  });


  it('should render (multiple)', async function() {

    // given
    const field = [
      schema.components.find(({ key }) => key === 'creditor'),
      schema.components.find(({ key }) => key === 'invoiceNumber'),
    ];

    const result = createPropertiesPanel({
      container,
      field
    });

    // then
    const placeholder = result.container.querySelector('.bio-properties-panel-placeholder');
    const text = placeholder.querySelector('.bio-properties-panel-placeholder-text');

    expect(placeholder).to.exist;
    expect(text.innerText).to.eql('Multiple form fields are selected. Select a single form field to edit its properties.');
  });


  it('should render (field)', async function() {

    // given
    const field = schema.components.find(({ key }) => key === 'creditor');

    const result = createPropertiesPanel({
      container,
      field
    });

    // then
    expect(result.container.querySelector('.fjs-properties-panel-placeholder')).not.to.exist;

    expect(result.container.querySelector('.bio-properties-panel-header-type')).to.exist;
    expect(result.container.querySelector('.bio-properties-panel-group')).to.exist;
  });


  describe('fields', function() {

    it('default', function() {

      // given
      const field = schema;

      const result = createPropertiesPanel({
        container,
        field
      });

      // then
      expectGroups(result.container, [
        'General'
      ]);

      expectGroupEntries(result.container, 'General', [
        'ID'
      ]);
    });


    describe('id', function() {

      const schema = {
        type: 'default',
        id: 'form',
        components: [
          { type: 'text', id: 'text', text: 'TEXT' }
        ]
      };


      it('should not be empty', function() {

        // given
        const editFieldSpy = spy();

        createPropertiesPanel({
          container,
          editField: editFieldSpy,
          field: schema
        });

        // assume
        const input = screen.getByLabelText('ID');

        expect(input.value).to.equal(schema.id);

        // when
        fireEvent.input(input, { target: { value: '' } });

        // then
        expect(editFieldSpy).not.to.have.been.called;

        const error = screen.getByText('Must not be empty.');

        expect(error).to.exist;
      });


      it('should not contain spaces', function() {

        // given
        const editFieldSpy = spy();

        createPropertiesPanel({
          container,
          editField: editFieldSpy,
          field: schema
        });

        // assume
        const input = screen.getByLabelText('ID');

        expect(input.value).to.equal(schema.id);

        // when
        fireEvent.input(input, { target: { value: 'fo rm' } });

        // then
        expect(editFieldSpy).not.to.have.been.called;

        const error = screen.getByText('Must not contain spaces.');

        expect(error).to.exist;
      });


      it('should be unique', function() {

        // given
        const editFieldSpy = spy();

        createPropertiesPanel({
          container,
          editField: editFieldSpy,
          field: schema,
          formFieldRegistry: {
            _ids: {
              assigned(id) {
                return schema.components.find((component) => component.id === id);
              }
            }
          }
        });

        // assume
        const input = screen.getByLabelText('ID');

        expect(input.value).to.equal(schema.id);

        // when
        fireEvent.input(input, { target: { value: 'text' } });

        // then
        expect(editFieldSpy).not.to.have.been.called;

        const error = screen.getByText('Must be unique.');

        expect(error).to.exist;
      });


      it('should be a valid QName', function() {

        // given
        const editFieldSpy = spy();

        createPropertiesPanel({
          container,
          editField: editFieldSpy,
          field: schema
        });

        // assume
        const input = screen.getByLabelText('ID');

        expect(input.value).to.equal(schema.id);

        // when
        fireEvent.input(input, { target: { value: '<HELLO>' } });

        // then
        expect(editFieldSpy).not.to.have.been.called;

        const error = screen.getByText('Must be a valid QName.');

        expect(error).to.exist;
      });

    });


    describe('button', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'submit');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Action'
        ]);
      });


      describe('action', function() {

        it('should change action', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ action }) => action === 'reset');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Action');

          expect(input.value).to.equal('reset');

          // when
          fireEvent.input(input, { target: { value: 'submit' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'action' ], 'submit');
        });

      });

    });


    describe('checkbox', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'approved');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Default value',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required'
        ]);
      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'approved');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('false');

          // when
          fireEvent.input(input, { target: { value: 'true' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], true);
        });

      });

    });


    describe('radio', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'product');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Options source',
          'Static options',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Default value',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Options source', [
          'Type'
        ]);

        expectGroupEntries(result.container, 'Static options', [
          [ 'Label', 2 ],
          [ 'Value', 2 ]
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required'
        ]);
      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'camunda-platform' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], 'camunda-platform');
        });


        it('should remove default value', function() {

          // given
          const editFieldSpy = spy();

          const field = defaultValuesSchema.components.find(({ key }) => key === 'product');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('camunda-platform');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
        });

      });


      describe('values', function() {

        it('should NOT order alphanumerical', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const group = findGroup(result.container, 'Static options');

          const list = group.querySelector('.bio-properties-panel-list');

          // then
          expect(getListOrdering(list)).to.eql([
            'Camunda Platform',
            'Camunda Cloud'
          ]);

        });


        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const addEntry = group.querySelector('.bio-properties-panel-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value 3',
              value: 'value3',
            }
          ]);
        });


        it('should add value with different index if already used', function() {

          // given
          const editFieldSpy = spy();

          const field = redundantValuesSchema.components.find(({ key }) => key === 'redundantValues');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const addEntry = group.querySelector('.bio-properties-panel-add-entry');
          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value 4',
              value: 'value4',
            }
          ]);
        });


        it('should remove value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

          fireEvent.click(removeEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            field.values[ 1 ]
          ]);
        });


        describe('validation', function() {

          describe('value', function() {

            it('should not be empty', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'product');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Radio_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: '' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must not be empty.');

              expect(error).to.exist;
            });


            it('should be unique', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'product');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Radio_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: 'camunda-cloud' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });


          describe('label', function() {

            it('should not be empty', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'product');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Label', { selector: '#bio-properties-panel-Radio_1-staticValues-0-label' });

              fireEvent.input(input, { target: { value: '' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must not be empty.');

              expect(error).to.exist;
            });


            it('should be unique', function() {


              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'product');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Label', { selector: '#bio-properties-panel-Radio_1-staticValues-0-label' });

              fireEvent.input(input, { target: { value: 'Camunda Cloud' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('static options', function() {

        it('should re-configure static source defaults', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(VALUES_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: VALUES_SOURCES.INPUT } });
          fireEvent.input(input, { target: { value: VALUES_SOURCES.STATIC } });

          // then
          expect(editFieldSpy).to.have.been.calledTwice;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            'values': VALUES_SOURCES_DEFAULTS[VALUES_SOURCES.STATIC],
            'valuesKey': undefined
          });
        });
      });


      describe('dynamic options', function() {

        it('should configure input source & cleanup static source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(VALUES_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: VALUES_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            'values': undefined,
            'valuesKey': '' });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'product');
          field = { ...field, values: undefined, valuesKey: '' };

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Input values key');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'newKey' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'valuesKey' ], 'newKey');

        });


        it('should not be empty', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'product');
          field = { ...field, values: undefined, valuesKey: '' };

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Input values key');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).not.to.have.been.called;

          const error = screen.getByText('Must not be empty.');

          expect(error).to.exist;
        });


        it('should not contain spaces', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'product');
          field = { ...field, values: undefined, valuesKey: '' };

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Input values key');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'credi tor' } });

          // then
          expect(editFieldSpy).not.to.have.been.called;

          const error = screen.getByText('Must not contain spaces.');

          expect(error).to.exist;
        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'product');
          field = { ...field, values: undefined, valuesKey: '' };

          const result = createPropertiesPanel({
            container,
            field
          });

          // then
          expectGroups(result.container, [
            'General',
            'Condition',
            'Options source',
            'Dynamic options',
            'Validation',
            'Custom properties'
          ]);

          expectGroupEntries(result.container, 'General', [
            'Field label',
            'Field description',
            'Key',
            'Disabled'
          ]);

          expectGroupEntries(result.container, 'Options source', [
            'Type'
          ]);

          expectGroupEntries(result.container, 'Dynamic options', [
            'Input values key'
          ]);

          expectGroupEntries(result.container, 'Validation', [
            'Required'
          ]);
        });

      });

    });


    describe('checklist', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'mailto');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Options source',
          'Static options',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Options source', [
          'Type'
        ]);

        expectGroupEntries(result.container, 'Static options', [
          [ 'Label', 3 ],
          [ 'Value', 3 ]
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required'
        ]);

      });


      describe('values', function() {

        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'mailto');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const addEntry = group.querySelector('.bio-properties-panel-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value 4',
              value: 'value4',
            }
          ]);
        });


        it('should remove value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'mailto');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

          fireEvent.click(removeEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            field.values[ 1 ],
            field.values[ 2 ]
          ]);
        });


        describe('validation', function() {

          describe('value', function() {

            it('should not be empty', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'mailto');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Checklist_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: '' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must not be empty.');

              expect(error).to.exist;
            });


            it('should be unique', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'mailto');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Checklist_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: 'manager' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('dynamic options', function() {

        it('should configure input source & cleanup static source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'mailto');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(VALUES_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: VALUES_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            'values': undefined,
            'valuesKey': '' });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'mailto');
          field = { ...field, values: undefined, valuesKey: '' };

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Input values key');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'newKey' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'valuesKey' ], 'newKey');

        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'mailto');
          field = { ...field, values: undefined, valuesKey: '' };

          const result = createPropertiesPanel({
            container,
            field
          });

          // then
          expectGroups(result.container, [
            'General',
            'Condition',
            'Options source',
            'Dynamic options',
            'Custom properties'
          ]);

          expectGroupEntries(result.container, 'General', [
            'Field label',
            'Field description',
            'Key',
            'Disabled'
          ]);

          expectGroupEntries(result.container, 'Options source', [
            'Type'
          ]);

          expectGroupEntries(result.container, 'Dynamic options', [
            'Input values key'
          ]);
        });

      });

    });


    describe('taglist', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'tags');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Options source',
          'Static options',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Options source', [
          'Type'
        ]);

        expectGroupEntries(result.container, 'Static options', [
          [ 'Label', 11 ],
          [ 'Value', 11 ]
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required'
        ]);
      });


      describe('values', function() {

        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const addEntry = group.querySelector('.bio-properties-panel-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value 12',
              value: 'value12',
            }
          ]);
        });


        it('should remove value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

          fireEvent.click(removeEntry);

          // then
          const expectedValues = [ ...field.values ];
          expectedValues.shift();

          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], expectedValues);
        });


        describe('validation', function() {

          describe('value', function() {

            it('should not be empty', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'tags');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Taglist_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: '' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must not be empty.');

              expect(error).to.exist;
            });


            it('should be unique', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'tags');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Taglist_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: 'tag2' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('Dynamic options', function() {

        it('should configure input source & cleanup static source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(VALUES_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: VALUES_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            'values': undefined,
            'valuesKey': '' });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'tags');
          field = { ...field, values: undefined, valuesKey: '' };

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Input values key');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'newKey' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'valuesKey' ], 'newKey');

        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'tags');
          field = { ...field, values: undefined, valuesKey: '' };

          const result = createPropertiesPanel({
            container,
            field
          });

          // then
          expectGroups(result.container, [
            'General',
            'Condition',
            'Options source',
            'Dynamic options',
            'Custom properties'
          ]);

          expectGroupEntries(result.container, 'General', [
            'Field label',
            'Field description',
            'Key',
            'Disabled'
          ]);

          expectGroupEntries(result.container, 'Options source', [
            'Type'
          ]);

          expectGroupEntries(result.container, 'Dynamic options', [
            'Input values key'
          ]);

        });

      });

    });


    describe('datetime', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'conversation');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Serialization',
          'Constraints',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Date label',
          'Time label',
          'Field description',
          'Key',
          'Subtype',
          'Use 24h',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Serialization', [
          'Time format'
        ]);

        expectGroupEntries(result.container, 'Constraints', [
          'Time interval',
          'Disallow past dates'
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required'
        ]);

      });
    });


    describe('select', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'language');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Options source',
          'Static options',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Default value',
          'Searchable',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Options source', [
          'Type'
        ]);

        expectGroupEntries(result.container, 'Static options', [
          [ 'Label', 2 ],
          [ 'Value', 2 ]
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required'
        ]);
      });


      describe('default value', function() {

        it('should not add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: EMPTY_OPTION } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
        });


        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'english' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], 'english');
        });


        it('should remove default value', function() {

          // given
          const editFieldSpy = spy();

          const field = defaultValuesSchema.components.find(({ key }) => key === 'language');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('english');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
        });

      });


      describe('values', function() {

        it('should NOT order alphanumerical', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const group = findGroup(result.container, 'Static options');

          const list = group.querySelector('.bio-properties-panel-list');

          // then
          expect(getListOrdering(list)).to.eql([
            'German',
            'English'
          ]);

        });


        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const addEntry = group.querySelector('.bio-properties-panel-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value 3',
              value: 'value3',
            }
          ]);
        });


        it('should remove value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(result.container, 'Static options');

          // when
          const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

          fireEvent.click(removeEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            field.values[ 1 ]
          ]);
        });


        describe('validation', function() {

          describe('value', function() {

            it('should not be empty', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'language');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Select_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: '' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must not be empty.');

              expect(error).to.exist;
            });


            it('should be unique', function() {

              // given
              const editFieldSpy = spy();

              const field = schema.components.find(({ key }) => key === 'language');

              createPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-Select_1-staticValues-0-value' });

              fireEvent.input(input, { target: { value: 'english' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('dynamic options', function() {

        it('should configure input source & cleanup static source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(VALUES_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: VALUES_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            'values': undefined,
            'valuesKey': '' });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'language');
          field = { ...field, values: undefined, valuesKey: '' };

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Input values key');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'newKey' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'valuesKey' ], 'newKey');

        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'language');
          field = { ...field, values: undefined, valuesKey: '' };

          const result = createPropertiesPanel({
            container,
            field
          });

          // then
          expectGroups(result.container, [
            'General',
            'Condition',
            'Options source',
            'Dynamic options',
            'Validation',
            'Custom properties'
          ]);

          expectGroupEntries(result.container, 'General', [
            'Field label',
            'Field description',
            'Key',
            'Disabled'
          ]);

          expectGroupEntries(result.container, 'Options source', [
            'Type'
          ]);

          expectGroupEntries(result.container, 'Dynamic options', [
            'Input values key'
          ]);

          expectGroupEntries(result.container, 'Validation', [
            'Required'
          ]);
        });

      });

    });


    describe('text', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ type }) => type === 'text');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Text'
        ]);
      });

    });


    describe('textfield', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'creditor');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Default value',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required',
          'Minimum length',
          'Maximum length',
          'Validation pattern',
          'Custom regular expression'
        ]);
      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'Max Mustermann GmbH' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], 'Max Mustermann GmbH');
        });


        it('should remove default value', function() {

          // given
          const editFieldSpy = spy();

          const field = defaultValuesSchema.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('Max Mustermann GmbH');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
        });

      });


      describe('validation', function() {

        describe('maximum length', function() {

          it('should have min value of 0', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Maximum length');

            expect(input.min).to.equal('0');

            // when
            fireEvent.input(input, { target: { value: -1 } });

            fireEvent.input(input, { target: { value: 1 } });

            // then
            expect(editFieldSpy).to.have.been.calledOnce;

            expect(editFieldSpy).to.have.been.calledWith(field, [ 'validate' ], {
              ...field.validate,
              maxLength: 1
            });
          });

        });


        describe('minimum length', function() {

          it('should have min value of 0', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Minimum length');

            expect(input.min).to.equal('0');

            // when
            fireEvent.input(input, { target: { value: -1 } });

            fireEvent.input(input, { target: { value: 1 } });

            // then
            expect(editFieldSpy).to.have.been.calledOnce;
            expect(editFieldSpy).to.have.been.calledWith(field, [ 'validate' ], {
              ...field.validate,
              minLength: 1
            });
          });

        });


        describe('key', function() {

          it('should not be empty', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('creditor');

            // when
            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });


          it('should not contain spaces', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('creditor');

            // when
            fireEvent.input(input, { target: { value: 'credi tor' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not contain spaces.');

            expect(error).to.exist;
          });


          it('should be unique', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
              formFieldRegistry: {
                _keys: {
                  assigned(key) {
                    return schema.components.find((component) => component.key === key);
                  }
                }
              }
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('creditor');

            // when
            fireEvent.input(input, { target: { value: 'amount' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must be unique.');

            expect(error).to.exist;
          });

        });

      });

    });


    describe('number', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'amount');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Serialization',
          'Validation',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field label',
          'Field description',
          'Key',
          'Default value',
          'Decimal digits',
          'Increment',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Serialization', [
          'Output as string'
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required',
          'Minimum',
          'Maximum'
        ]);
      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'amount');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 250 } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], 250);
        });


        it('should remove default value', function() {

          // given
          const editFieldSpy = spy();

          const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field: {
              ...field,
              defaultValue: 0
            }
          });

          // assume
          const input = screen.getByLabelText('Default value');

          expect(input.value).to.equal('0');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);

        });

      });

      describe('decimal digits', function() {

        it('should add positive integer values', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'amount');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Decimal digits');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 100 } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'decimalDigits' ], 100);
        });


        it('should add zero', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'amount');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Decimal digits');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 0 } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'decimalDigits' ], 0);
        });


        it('should reject negative values', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'amount');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Decimal digits');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: -1 } });

          // then
          expect(editFieldSpy).to.not.have.been.called;
        });


        it('should reject decimal values', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'amount');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Decimal digits');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: -1 } });

          // then
          expect(editFieldSpy).to.not.have.been.called;
        });

      });


      describe('validation', function() {

        describe('default value', function() {

          it('should refuse non numeric values', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Default value');

            // when
            fireEvent.input(input, { target: { value: 'Joe' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should be a valid number');
            expect(error).to.exist;

          });


          it('should refuse values not conforming to decimal digits', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field: {
                ...field,
                decimalDigits: 4,
              }
            });

            // assume
            const input = screen.getByLabelText('Default value');

            // when
            fireEvent.input(input, { target: { value: '0.00001' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should not contain more than 4 decimal digits');
            expect(error).to.exist;

          });


        });


        describe('increment', function() {

          it('should reject non-numeric values', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: 'Joe' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should be a valid number.');
            expect(error).to.exist;

          });


          it('should clear', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).to.have.been.calledWith(field, [ 'increment' ], undefined);

          });


          it('should trim leading zeroes', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: '0005.1000' } });

            // then
            expect(editFieldSpy).to.have.been.calledWith(field, [ 'increment' ], '5.1000');

          });


          it('should not trim zero if needed', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: '0.1000' } });

            // then
            expect(editFieldSpy).to.have.been.calledWith(field, [ 'increment' ], '0.1000');

          });


          it('should not trim decimal point', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: '5.' } });

            // then
            expect(editFieldSpy).to.have.been.calledWith(field, [ 'increment' ], '5.');

          });


          it('should reject values smaller than the unit of the smallest digit', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field: {
                ...field,
                decimalDigits: 4,
              }
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: '0.00001' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should be at least 0.0001.');
            expect(error).to.exist;

          });


          it('should be greater than zero', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Increment');

            // when
            fireEvent.input(input, { target: { value: '-0.00001' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should be greater than zero.');
            expect(error).to.exist;

          });

        });


        describe('decimalDigits', function() {

          it('should reject negative values', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Decimal digits');

            // when
            fireEvent.input(input, { target: { value: -1 } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should be greater than or equal to zero.');
            expect(error).to.exist;

          });


          it('should reject non-integer values', function() {

            // given
            const editFieldSpy = spy();

            const field = defaultValuesSchema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Decimal digits');

            // when
            fireEvent.input(input, { target: { value: 1.5 } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Should be an integer.');
            expect(error).to.exist;

          });

        });

        describe('key', function() {

          it('should not be empty', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('amount');

            // when
            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });


          it('should not contain spaces', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('amount');

            // when
            fireEvent.input(input, { target: { value: 'amou nt' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not contain spaces.');

            expect(error).to.exist;
          });


          it('should be unique', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'amount');

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
              formFieldRegistry: {
                _keys: {
                  assigned(key) {
                    return schema.components.find((component) => component.key === key);
                  }
                }
              }
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('amount');

            // when
            fireEvent.input(input, { target: { value: 'creditor' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must be unique.');

            expect(error).to.exist;
          });

        });

      });

    });


    describe('image', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ source }) => source === '=logo');

        const result = createPropertiesPanel({
          container,
          field
        });

        // then
        expectGroups(result.container, [
          'General',
          'Condition',
          'Custom properties'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Image source',
          'Alternative text',
        ]);
      });


      describe('source', function() {

        it('should update source', async function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ source }) => source === '=logo');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = domQuery('[name=source] [role="textbox"]', container);
          expect(input.textContent).to.equal('logo');

          // when
          await setEditorValue(input, 'foo');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'source' ], '=foo');
        });


        it('should remove source', async function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ source }) => source === '=logo');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = domQuery('[name=source] [role="textbox"]', container);
          expect(input.textContent).to.equal('logo');

          // when
          await setEditorValue(input, '');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'source' ], undefined);
        });

      });


      describe('alt', function() {

        it('should update alt text', async function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ source }) => source === '=logo');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = domQuery('input[name=alt]', container);
          expect(input.value).to.equal('The bpmn.io logo');

          // when
          fireEvent.input(input, { target: { value: 'An image' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'alt' ], 'An image');
        });


        it('should remove alt text', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ source }) => source === '=logo');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = domQuery('input[name=alt]', container);
          expect(input.value).to.equal('The bpmn.io logo');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'alt' ], undefined);
        });

      });

    });

  });


  describe('custom properties', function() {

    it('should add property', function() {

      // given
      const editFieldSpy = spy();

      const field = schema.components.find(({ key }) => key === 'creditor');

      const result = createPropertiesPanel({
        container,
        editField: editFieldSpy,
        field
      });

      const group = findGroup(result.container, 'Custom properties');

      // when
      const addEntry = group.querySelector('.bio-properties-panel-add-entry');

      fireEvent.click(addEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'properties' ], {
        ...field.properties,
        key4: 'value'
      });
    });


    it('should add property with different index if already used', function() {

      // given
      const editFieldSpy = spy();


      const field = redundantValuesSchema.components.find(({ key }) => key === 'redundantValues');

      const result = createPropertiesPanel({
        container,
        editField: editFieldSpy,
        field
      });

      const group = findGroup(result.container, 'Custom properties');

      // when
      const addEntry = group.querySelector('.bio-properties-panel-add-entry');
      fireEvent.click(addEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'properties' ], {
        key2: 'value',
        key3: 'value'
      });
    });


    it('should remove property', function() {

      // given
      const editFieldSpy = spy();

      const field = schema.components.find(({ key }) => key === 'creditor');

      const result = createPropertiesPanel({
        container,
        editField: editFieldSpy,
        field
      });

      const group = findGroup(result.container, 'Custom properties');

      // when
      const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

      fireEvent.click(removeEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'properties' ], {
        ...removeKey(field.properties, 'firstName')
      });
    });


    describe('validation', function() {

      describe('custom property key', function() {

        it('should not be empty', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-Textfield_1-property-0-key' });

          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.not.have.been.called;

          const error = screen.getByText('Must not be empty.');

          expect(error).to.exist;
        });


        it('should be unique', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-Textfield_1-property-0-key' });

          fireEvent.input(input, { target: { value: 'middleName' } });

          // then
          expect(editFieldSpy).to.not.have.been.called;

          const error = screen.getByText('Must be unique.');

          expect(error).to.exist;
        });

      });

    });

  });

});


// helpers //////////////

function createPropertiesPanel(options = {}) {
  const {
    container,
    editField = () => {},
    isTemplate = () => false,
    evaluateTemplate = (value) => `Evaluation of "${value}"`,
    field = null
  } = options;

  let {
    eventBus,
    formEditor,
    formLayoutValidator,
    modeling,
    selection,
    templating
  } = options;

  if (!eventBus) {
    eventBus = new eventBusMock();
  }

  if (!formEditor) {
    formEditor = new formEditorMock({
      state: { schema: options.schema !== undefined ? options.schema : schema }
    });
  }

  if (!formLayoutValidator) {
    formLayoutValidator = new formLayoutValidatorMock();
  }

  if (!modeling) {
    modeling = new modelingMock({
      editFormField: editField
    });
  }

  if (!selection) {
    selection = new selectionMock({
      selection: field
    });
  }

  if (!templating) {
    templating = new templatingMock({
      isTemplate,
      evaluate: evaluateTemplate
    });
  }

  return render(
    WithFormEditorContext(<PropertiesPanel />, {
      ...options,
      eventBus,
      formEditor,
      formLayoutValidator,
      modeling,
      selection,
      templating
    }),
    {
      container
    }
  );
}

function expectGroups(container, groupLabels) {
  groupLabels.forEach(groupLabel => {
    expect(findGroup(container, groupLabel)).to.exist;
  });
}

function expectGroupEntries(container, groupLabel, entryLabels) {
  entryLabels.forEach(entryLabel => {
    if (Array.isArray(entryLabel)) {
      expect(findEntries(container, groupLabel, entryLabel[ 0 ])).to.have.length(entryLabel[ 1 ]);
    } else {
      expect(findEntries(container, groupLabel, entryLabel)).to.have.length(1);
    }
  });
}

function findGroup(container, groupLabel) {
  let groups = container.querySelectorAll('.bio-properties-panel-group');
  const groupIndex = findGroupIndex(container, groupLabel);

  if (groupIndex >= 0) {
    return groups[groupIndex];
  }
}

function findGroupIndex(container, groupLabel) {
  const groupLabels = container.querySelectorAll('.bio-properties-panel-group-header-title');
  return Array.from(groupLabels).findIndex(group => group.textContent === groupLabel);
}

function findEntries(container, groupLabel, entryLabel) {
  const group = findGroup(container, groupLabel);

  if (group) {
    const entries = group.querySelectorAll('.bio-properties-panel-label');

    return Array.from(entries).filter(entry => entry.textContent === entryLabel);
  }
}

function getListOrdering(list) {
  let ordering = [];

  const items = list.querySelectorAll('.bio-properties-panel-list-item', list);

  items.forEach(item => {
    const collapsible = item.querySelector('.bio-properties-panel-collapsible-entry', item);

    ordering.push(
      collapsible
        .querySelector('.bio-properties-panel-collapsible-entry-header-title')
        .textContent
    );
  });

  return ordering;
}
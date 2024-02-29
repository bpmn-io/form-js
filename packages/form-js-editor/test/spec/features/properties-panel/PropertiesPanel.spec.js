import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/preact/pure';

import { query as domQuery } from 'min-dom';

import { OPTIONS_SOURCES, OPTIONS_SOURCES_DEFAULTS } from '@bpmn-io/form-js-viewer';
import { removeKey } from '../../../../src/features/properties-panel/groups/CustomPropertiesGroup';

import { PropertiesProvider } from '../../../../src/features/properties-panel/PropertiesProvider';
import { PropertiesPanel } from '../../../../src/features/properties-panel/PropertiesPanel';
import { FormFields } from '@bpmn-io/form-js-viewer';

import {
  EventBusMock,
  PropertiesPanelMock,
  createMockInjector
} from './helper/mocks';

import schema from '../../form.json';
import defaultValuesSchema from '../../defaultValues.json';
import redundantValuesSchema from '../../redundantValues.json';
import iframeSchema from '../../../../../form-js-viewer/test/spec/iframes.json';
import tableSchema from '../../form-table.json';

import { insertStyles, setEditorValue } from '../../../TestHelper';

import { EMPTY_OPTION } from '../../../../src/features/properties-panel/entries/DefaultValueEntry';

insertStyles();

const spy = sinon.spy;


describe('properties panel', function() {

  let parent, container, propertiesPanel;

  const bootstrapPropertiesPanel = ({ bootstrapExecute = () => {}, ...options }) => {
    return act(() => {
      propertiesPanel = createPropertiesPanel(options);
      bootstrapExecute(propertiesPanel);
    });
  };

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
    bootstrapPropertiesPanel({ container, schema: null });

    // then
    const placeholder = propertiesPanel.container.querySelector('.bio-properties-panel-placeholder');
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

    bootstrapPropertiesPanel({
      container,
      field
    });

    // then
    const placeholder = container.querySelector('.bio-properties-panel-placeholder');
    const text = placeholder.querySelector('.bio-properties-panel-placeholder-text');

    expect(placeholder).to.exist;
    expect(text.innerText).to.eql('Multiple form fields are selected. Select a single form field to edit its properties.');
  });


  it('should render (field)', async function() {

    // given
    const field = schema.components.find(({ key }) => key === 'creditor');

    bootstrapPropertiesPanel({
      container,
      field
    });

    // then
    expect(container.querySelector('.fjs-properties-panel-placeholder')).not.to.exist;

    expect(container.querySelector('.bio-properties-panel-header-type')).to.exist;
    expect(container.querySelector('.bio-properties-panel-group')).to.exist;
  });


  describe('fields', function() {

    it('default', function() {

      // given
      const field = schema;

      bootstrapPropertiesPanel({
        container,
        field
      });

      // then
      expectPanelStructure(container, {
        'General': [
          'ID'
        ]
      });
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

        bootstrapPropertiesPanel({
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

        bootstrapPropertiesPanel({
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

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field: schema,
          services: {
            formFieldRegistry: {
              _ids: {
                assigned(id) {
                  return schema.components.find((component) => component.id === id);
                }
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

        bootstrapPropertiesPanel({
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
        const field = schema.components.find(({ action }) => action === 'submit');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Action'
          ],
          'Condition': [],
          'Custom properties': []
        });
      });


      describe('action', function() {

        it('should change action', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ action }) => action === 'reset');

          bootstrapPropertiesPanel({
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

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Default value',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Validation': [
            'Required'
          ],
          'Custom properties': []
        });
      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'approved');

          bootstrapPropertiesPanel({
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

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Default value',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Options source': [
            'Type'
          ],
          'Static options': [
            [ 'Label', 2 ],
            [ 'Value', 2 ]
          ],
          'Validation': [
            'Required'
          ],
          'Custom properties': []
        });
      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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


      describe('options', function() {

        it('should NOT order alphanumerical', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const group = findGroup(container, 'Static options');

          const list = group.querySelector('.bio-properties-panel-list');

          // then
          expect(getListOrdering(list)).to.eql([
            'Camunda Platform',
            'Camunda Cloud'
          ]);

        });


        it('should add option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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


        it('should add option with different index if already used', function() {

          // given
          const editFieldSpy = spy();

          const field = redundantValuesSchema.components.find(({ key }) => key === 'redundantValues');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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


        it('should remove option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Label', { selector: '#bio-properties-panel-staticOptions-0-label' });

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Label', { selector: '#bio-properties-panel-staticOptions-0-label' });

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

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.INPUT } });
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.STATIC } });

          // then
          expect(editFieldSpy).to.have.been.calledTwice;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            values: OPTIONS_SOURCES_DEFAULTS[OPTIONS_SOURCES.STATIC]
          });
        });
      });


      describe('dynamic options', function() {

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            valuesKey: '',
          });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'product');
          field = { ...field, values: undefined, valuesKey: '' };

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          expectPanelStructure(container, {
            'General': [
              'Field label',
              'Field description',
              'Key',
              'Disabled',
              'Read only'
            ],
            'Condition': [],
            'Options source': [
              'Type'
            ],
            'Dynamic options': [
              'Input values key'
            ],
            'Custom properties': []
          });
        });

      });

    });


    describe('checklist', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'mailto');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Options source': [
            'Type'
          ],
          'Static options': [
            [ 'Label', 3 ],
            [ 'Value', 3 ]
          ],
          'Validation': [
            'Required'
          ],
          'Custom properties': []
        });
      });


      describe('options', function() {

        it('should add option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'mailto');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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


        it('should remove option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'mailto');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

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

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'mailto');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            valuesKey: ''
          });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'mailto');
          field = { ...field, values: undefined, valuesKey: '' };

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          expectPanelStructure(container, {
            'General': [
              'Field label',
              'Field description',
              'Key',
              'Disabled',
              'Read only'
            ],
            'Condition': [],
            'Options source': [
              'Type'
            ],
            'Dynamic options': [
              'Input values key'
            ],
            'Custom properties': []
          });

        });

      });

    });


    describe('taglist', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'tags');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Options source': [
            'Type'
          ],
          'Static options': [
            [ 'Label', 11 ],
            [ 'Value', 11 ]
          ],
          'Validation': [
            'Required'
          ],
          'Custom properties': []
        });

      });


      describe('options', function() {

        it('should add option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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


        it('should remove option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

              fireEvent.input(input, { target: { value: 'tag2' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('dynamic options (valuesKey)', function() {

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            valuesKey: ''
          });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'tags');
          field = { ...field, values: undefined, valuesKey: '' };

          bootstrapPropertiesPanel({
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


        it('should auto focus other entry', async function() {

          // given
          let field = schema.components.find(({ key }) => key === 'tags');

          const eventBus = new EventBusMock();

          const editField = () => {
            field = { ...field, values: undefined, valuesKey: '' };
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection: {
                get: () => field
              }
            }
          });

          // assume
          const input = screen.getByLabelText('Type');
          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.INPUT } });
          await act(() => eventBus.fire('changed'));

          // then
          const valuesKeyInput = screen.getByLabelText('Input values key');

          await waitFor(() => {
            expect(document.activeElement).to.eql(valuesKeyInput);
          });
        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'tags');
          field = { ...field, values: undefined, valuesKey: '' };

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          expectPanelStructure(container, {
            'General': [
              'Field label',
              'Field description',
              'Key',
              'Disabled',
              'Read only'
            ],
            'Condition': [],
            'Options source': [
              'Type'
            ],
            'Dynamic options': [
              'Input values key'
            ],
            'Custom properties': []
          });

        });

      });


      describe('dynamic options (valuesExpression)', function() {

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'tags');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.EXPRESSION } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            valuesExpression: '='
          });
        });


        it('should configure valuesExpression', async function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'tags');
          field = { ...field, values: undefined, valuesExpression: '=' };

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = findTextbox('optionsExpression-expression', container);

          expect(input.textContent).to.equal('');

          // when
          await setEditorValue(input, 'newVal');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'valuesExpression' ], '=newVal');
        });


        it('should auto focus other entry', async function() {

          // given
          let field = schema.components.find(({ key }) => key === 'tags');

          const eventBus = new EventBusMock();

          const editField = () => {
            field = { ...field, values: undefined, valuesExpression: '=' };
          };

          const selection = {
            get: () => field
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection
            }
          });

          // assume
          const input = screen.getByLabelText('Type');
          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.EXPRESSION } });
          await act(() => eventBus.fire('changed'));

          // then
          const editor = findTextbox('optionsExpression-expression', container);

          await waitFor(() => {
            expect(document.activeElement).to.eql(editor);
          });
        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'tags');
          field = { ...field, values: undefined, valuesExpression: '=' };

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          expectPanelStructure(container, {
            'General': [
              'Field label',
              'Field description',
              'Key',
              'Disabled',
              'Read only'
            ],
            'Condition': [],
            'Options source': [
              'Type'
            ],
            'Options expression': [
              'Options expression'
            ],
            'Validation': [
              'Required'
            ],
            'Custom properties': []
          });

        });

      });

    });


    describe('datetime', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'conversation');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Date label',
            'Time label',
            'Field description',
            'Key',
            'Subtype',
            'Use 24h',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Serialization': [
            'Time format'
          ],
          'Constraints': [
            'Time interval',
            'Disallow past dates'
          ],
          'Validation': [
            'Required'
          ],
          'Custom properties': []
        });

      });

    });


    describe('select', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'language');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Default value',
            'Searchable',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Options source': [
            'Type'
          ],
          'Static options': [
            [ 'Label', 2 ],
            [ 'Value', 2 ]
          ],
          'Validation': [
            'Required'
          ],
          'Custom properties': []
        });

      });


      describe('default value', function() {

        it('should not add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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


      describe('options', function() {

        it('should NOT order alphanumerical', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const group = findGroup(container, 'Static options');

          const list = group.querySelector('.bio-properties-panel-list');

          // then
          expect(getListOrdering(list)).to.eql([
            'German',
            'English'
          ]);

        });


        it('should auto focus other entry', async function() {

          // given
          let field = {
            key: 'dri',
            label: 'Assign DRI',
            type: 'select',
            valuesKey: 'queriedDRIs'
          };

          const eventBus = new EventBusMock();

          const editField = () => {
            field = { ...field, values: [ 'foo' ], valuesKey: undefined };
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection: {
                get: () => field
              }
            }
          });

          // assume
          const input = screen.getByLabelText('Type');
          expect(input.value).to.equal(OPTIONS_SOURCES.INPUT);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.STATIC } });
          await act(() => eventBus.fire('changed'));

          // then
          const optionLabelInput = screen.getByLabelText('Label');

          await waitFor(() => {
            expect(document.activeElement).to.eql(optionLabelInput);
          });
        });


        it('should add option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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


        it('should remove option', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Static options');

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

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

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

              fireEvent.input(input, { target: { value: 'english' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must be unique.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('dynamic options (valuesKey)', function() {

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.INPUT } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            valuesKey: ''
          });
        });


        it('should configure valuesKey', function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'language');
          field = { ...field, values: undefined, valuesKey: '' };

          bootstrapPropertiesPanel({
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


        it('should auto focus other entry', async function() {

          // given
          let field = schema.components.find(({ key }) => key === 'language');

          const eventBus = new EventBusMock();

          const editField = () => {
            field = { ...field, values: undefined, valuesKey: '' };
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection: {
                get: () => field
              }
            }
          });

          // assume
          const input = screen.getByLabelText('Type');
          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.EXPRESSION } });
          await act(() => eventBus.fire('changed'));

          // then
          const valuesKeyInput = screen.getByLabelText('Input values key');

          await waitFor(() => {
            expect(document.activeElement).to.eql(valuesKeyInput);
          });
        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'language');
          field = { ...field, values: undefined, valuesKey: '' };

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          expectPanelStructure(container, {
            'General': [
              'Field label',
              'Field description',
              'Key',
              'Disabled',
              'Read only'
            ],
            'Condition': [],
            'Options source': [
              'Type'
            ],
            'Dynamic options': [
              'Input values key'
            ],
            'Validation': [
              'Required'
            ],
            'Custom properties': []
          });

        });

      });


      describe('dynamic options (valuesExpression)', function() {

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.EXPRESSION } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            valuesExpression: '='
          });
        });


        it('should configure valuesExpression', async function() {

          // given
          const editFieldSpy = spy();

          let field = schema.components.find(({ key }) => key === 'language');
          field = { ...field, values: undefined, valuesExpression: '=' };

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = findTextbox('optionsExpression-expression', container);

          expect(input.textContent).to.equal('');

          // when
          await setEditorValue(input, 'newVal');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'valuesExpression' ], '=newVal');
        });


        it('should auto focus other entry', async function() {

          // given
          let field = schema.components.find(({ key }) => key === 'language');

          const eventBus = new EventBusMock();

          const editField = () => {
            field = { ...field, values: undefined, valuesExpression: '=' };
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection: {
                get: () => field
              }
            }
          });

          // assume
          const input = screen.getByLabelText('Type');
          expect(input.value).to.equal(OPTIONS_SOURCES.STATIC);

          // when
          fireEvent.input(input, { target: { value: OPTIONS_SOURCES.EXPRESSION } });
          await act(() => eventBus.fire('changed'));

          // then
          const editor = findTextbox('optionsExpression-expression', container);

          await waitFor(() => {
            expect(document.activeElement).to.eql(editor);
          });
        });


        it('entries should change', function() {

          // given
          let field = schema.components.find(({ key }) => key === 'language');
          field = { ...field, values: undefined, valuesExpression: '=' };

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          expectPanelStructure(container, {
            'General': [
              'Field label',
              'Field description',
              'Key',
              'Disabled',
              'Read only'
            ],
            'Condition': [],
            'Options source': [
              'Type'
            ],
            'Options expression': [
              'Options expression'
            ],
            'Validation': [
              'Required'
            ],
            'Custom properties': []
          });

        });

      });

    });


    describe('text', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ type }) => type === 'text');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Text'
          ],
          'Condition': [],
          'Custom properties': []
        });

      });

    });


    describe('spacer', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ type }) => type === 'spacer');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Height'
          ],
          'Condition': [],
          'Layout': [
            'Columns'
          ],
          'Custom properties': []
        });

      });

    });


    describe('group', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ type }) => type === 'group');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Group label',
            'Path'
          ],
          'Condition': [
            'Hide if'
          ],
          'Layout': [
            'Columns'
          ],
          'Appearance': [
            'Show outline',
            'Vertical alignment'
          ],
          'Custom properties': []
        });

      });

    });


    describe('dynamiclist', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ type }) => type === 'dynamiclist');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Group label',
            'Path',
            'Default number of items',
            'Allow add/delete items',
            'Disable collapse',
            'Number of non-collapsing items'
          ],
          'Condition': [
            'Hide if'
          ],
          'Layout': [
            'Columns'
          ],
          'Appearance': [
            'Show outline',
            'Vertical alignment'
          ],
          'Custom properties': []
        });

      });

    });


    describe('textfield', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'creditor');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Default value',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Validation': [
            'Required',
            'Minimum length',
            'Maximum length',
            'Validation pattern',
            'Custom regular expression'
          ],
          'Custom properties': []
        });

      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'creditor');

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            // the fx toggle is screened as well
            const input = screen.getAllByLabelText('Maximum length').find((el) => el.type === 'number');

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

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getAllByLabelText('Minimum length').find((el) => el.type === 'number');

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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            const error = screen.getByText('Must be a variable or a dot separated path.');

            expect(error).to.exist;
          });


          it('should not conflict', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
              claimedPaths: [ 'amount' ],
              valuePaths: {
                [ field.id ] : [ 'amount' ]
              }
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('creditor');

            // when
            fireEvent.input(input, { target: { value: 'amount' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not conflict with other key/path assignments.');

            expect(error).to.exist;
          });


          it('should not allow numerical key segments', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'creditor');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('creditor');

            // when
            fireEvent.input(input, { target: { value: 'credi.0.tor' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not contain numerical path segments.');

            expect(error).to.exist;

          });

        });

      });

    });


    describe('number', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ key }) => key === 'amount');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Field label',
            'Field description',
            'Key',
            'Default value',
            'Decimal digits',
            'Increment',
            'Disabled',
            'Read only'
          ],
          'Condition': [],
          'Serialization': [
            'Output as string'
          ],
          'Validation': [
            'Required',
            'Minimum',
            'Maximum'
          ],
          'Custom properties': []
        });

      });


      describe('default value', function() {

        it('should add default value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'amount');

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            bootstrapPropertiesPanel({
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

            const error = screen.getByText('Must be a variable or a dot separated path.');

            expect(error).to.exist;
          });


          it('should not conflict', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'amount');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
              claimedPaths: [ 'creditor' ],
              valuePaths: {
                [ field.id ] : [ 'creditor' ]
              }
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('amount');

            expect(editFieldSpy).not.to.have.been.called;

            // when
            fireEvent.input(input, { target: { value: 'creditor' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not conflict with other key/path assignments.');

            expect(error).to.exist;
          });


          it('should not allow numerical key segments', function() {

            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'amount');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field
            });

            // assume
            const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-key' });

            expect(input.value).to.equal('amount');

            // when
            fireEvent.input(input, { target: { value: 'amou.0.nt' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must not contain numerical path segments.');

            expect(error).to.exist;

          });

        });

      });

      describe('read only', function() {

        it('should not render when disabled', function() {

          // given
          const field = schema.components.find(({ key }) => key === 'amount');
          field.disabled = true;

          bootstrapPropertiesPanel({
            container,
            field
          });

          // then
          const readOnlyElement = screen.queryByLabelText('Read only');
          expect(readOnlyElement).to.not.exist;

        });

      });

    });


    describe('image', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ source }) => source === '=logo');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Image source',
            'Alternative text'
          ],
          'Condition': [],
          'Custom properties': []
        });

      });


      describe('source', function() {

        it('should update source', async function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ source }) => source === '=logo');

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
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

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const feelers = findFeelers('alt', container);
          expect(feelers.textContent).to.equal('The bpmn.io logo');

          const input = feelers.querySelector('div[contenteditable="true"]');

          // when
          await setEditorValue(input, 'An image');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'alt' ], 'An image');
        });


        it('should remove alt text', async function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ source }) => source === '=logo');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const feelers = findFeelers('alt', container);
          expect(feelers.textContent).to.equal('The bpmn.io logo');

          const input = feelers.querySelector('div[contenteditable="true"]');

          // when
          await setEditorValue(input, '');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'alt' ], undefined);
        });

      });

    });


    describe('expression field', function() {

      it('entries', function() {

        // given
        const field = schema.components.find(({ type }) => type === 'expression');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Key',
            'Target value',
            'Compute on'
          ],
          'Condition': [
            'Deactivate if'
          ],
          'Layout': [
            'Columns'
          ],
          'Custom properties': []
        });

      });

    });


    describe('iframe', function() {

      it('entries', function() {

        // given
        const field = iframeSchema.components.find(({ url }) => url === 'https://bpmn.io/');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Title',
            'URL',
            'Height'
          ],
          'Security attributes': [],
          'Layout': [
            'Columns'
          ],
          'Custom properties': []
        });

      });


      describe('url', function() {

        it('should update url', async function() {

          // given
          const editFieldSpy = spy();

          const field = iframeSchema.components.find(({ url }) => url === 'https://bpmn.io/');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const feelers = findFeelers('url', container);
          expect(feelers.textContent).to.equal('https://bpmn.io/');

          const input = feelers.querySelector('div[contenteditable="true"]');

          // when
          await setEditorValue(input, 'https://foo.png');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'url' ], 'https://foo.png');
        });


        it('should remove url', async function() {

          // given
          const editFieldSpy = spy();

          const field = iframeSchema.components.find(({ url }) => url === 'https://bpmn.io/');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const feelers = findFeelers('url', container);
          const input = feelers.querySelector('div[contenteditable="true"]');

          // when
          await setEditorValue(input, '');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'url' ], undefined);
        });


        it('should show error', async function() {

          // given
          const field = iframeSchema.components.find(({ url }) => url === 'https://bpmn.io/');

          bootstrapPropertiesPanel({
            container,
            field
          });

          const feelers = findFeelers('url', container);
          expect(feelers.textContent).to.equal('https://bpmn.io/');

          const input = feelers.querySelector('div[contenteditable="true"]');

          // when
          await setEditorValue(input, 'http://foo.png');

          // then
          const error = screen.getByText('For security reasons the URL must start with "https".');

          expect(error).to.exist;
        });

      });


      it('should NOT show error for expressions', async function() {

        // given
        const field = iframeSchema.components.find(({ url }) => url === 'https://bpmn.io/');

        bootstrapPropertiesPanel({
          container,
          field
        });

        const feelers = findFeelers('url', container);
        expect(feelers.textContent).to.equal('https://bpmn.io/');

        const input = feelers.querySelector('div[contenteditable="true"]');

        // when
        await setEditorValue(input, '=url');

        // then
        const error = screen.queryByText('For security reasons the URL must start with "https".');

        expect(error).not.to.exist;
      });

    });


    describe('table', function() {

      it('entries static headers', function() {

        // given
        const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Table label',
            'Data source',
            'Pagination',
            'Number of rows per page'
          ],
          'Headers source': [
            'Type'
          ],
          'Header items': [
            [ 'Label', 3 ],
            [ 'Key', 3 ]
          ],
          'Condition': [],
          'Layout': [
            'Columns'
          ],
          'Custom properties': []
        });

      });


      it('entries static headers', function() {

        // given
        const field = tableSchema.components.find(({ label }) => label === 'dynamic-headers-table');

        bootstrapPropertiesPanel({
          container,
          field
        });

        // then
        expectPanelStructure(container, {
          'General': [
            'Table label',
            'Data source',
            'Pagination',
            'Number of rows per page'
          ],
          'Headers source': [
            'Type',
            'Expression'
          ],
          'Condition': [],
          'Layout': [
            'Columns'
          ],
          'Custom properties': []
        });

      });


      describe('columns', function() {

        it('should auto focus other entry', async function() {

          // given
          let field = {
            label: 'Table',
            type: 'table',
            id: 'Field_0k6resc',
            dataSource: 'Field_0k6resc',
            columnsExpression: '=tableHeaders',
          };

          const eventBus = new EventBusMock();

          const selection = {
            get: () => field
          };

          const editField = () => {
            const { columnsExpression:_, ...renderedField } = field;
            field = {
              ...renderedField,
              columns:[
                {
                  label:'Column',
                  key:'inputVariable'
                }
              ]
            };
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection
            }
          });

          // assume
          const input = screen.getByLabelText('Type');

          // when
          fireEvent.input(input, { target: { value: 'static' } });
          await act(() => eventBus.fire('changed'));

          // then
          const optionLabelInput = screen.getByLabelText('Label');

          await waitFor(() => {
            expect(document.activeElement).to.eql(optionLabelInput);
          });
        });


        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Header items');

          // when
          const addEntry = group.querySelector('.bio-properties-panel-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'columns' ], [
            ...field.columns,
            {
              label: 'Column',
              key: 'inputVariable',
            }
          ]);
        });


        it('should remove value', function() {

          // given
          const editFieldSpy = spy();

          const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          const group = findGroup(container, 'Header items');

          // when
          const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

          fireEvent.click(removeEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'columns' ], [
            {
              label: 'Name',
              key: 'name'
            },
            {
              label: 'Date',
              key: 'date'
            }
          ]);
        });


        describe('validation', function() {

          describe('key', function() {

            it('should not be empty', function() {

              // given
              const editFieldSpy = spy();

              const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

              bootstrapPropertiesPanel({
                container,
                editField: editFieldSpy,
                field
              });

              // when
              const input = screen.getByLabelText('Key', { selector: `#bio-properties-panel-${field.id}-columns-0-key` });

              fireEvent.input(input, { target: { value: '' } });

              // then
              expect(editFieldSpy).to.not.have.been.called;

              const error = screen.getByText('Must not be empty.');

              expect(error).to.exist;
            });

          });

        });

      });


      describe('dynamic options (columnsExpression)', function() {

        it('should configure input source', function() {

          // given
          const editFieldSpy = spy();

          const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Type');

          expect(input.value).to.equal('static');

          // when
          fireEvent.input(input, { target: { value: 'expression' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, {
            columnsExpression:'='
          });
        });


        it('should configure columnsExpression', async function() {

          // given
          const editFieldSpy = spy();

          const field = tableSchema.components.find(({ label }) => label === 'dynamic-headers-table');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = findTextbox(`${field.id}-columnsExpression`, container);

          expect(input.textContent).to.equal('tableHeaders');

          // when
          await setEditorValue(input, 'newVal');

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'columnsExpression' ], '=newVal');
        });


        it('should auto focus other entry', async function() {

          // given
          let field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

          const eventBus = new EventBusMock();

          const selection = {
            get: () => field
          };

          const editField = () => {
            const { columns:_, ...renderedField } = field;
            field = { ...renderedField, columnsExpression: '=' };
          };

          bootstrapPropertiesPanel({
            container,
            editField,
            field,
            services: {
              eventBus,
              selection
            }
          });

          // assume
          const input = screen.getByLabelText('Type');
          expect(input.value).to.equal('static');

          // when
          fireEvent.input(input, { target: { value: 'expression' } });
          await act(() => eventBus.fire('changed'));

          // then
          const editor = findTextbox(`${field.id}-columnsExpression`, container);

          await waitFor(() => {
            expect(document.activeElement).to.eql(editor);
          });
        });

      });

    });

  });


  describe('custom properties', function() {

    it('should add property', function() {

      // given
      const editFieldSpy = spy();

      const field = schema.components.find(({ key }) => key === 'creditor');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field
      });

      const group = findGroup(container, 'Custom properties');

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

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field
      });

      const group = findGroup(container, 'Custom properties');

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

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field
      });

      const group = findGroup(container, 'Custom properties');

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

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-property-0-key' });

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

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-property-0-key' });

          fireEvent.input(input, { target: { value: 'middleName' } });

          // then
          expect(editFieldSpy).to.not.have.been.called;

          const error = screen.getByText('Must be unique.');

          expect(error).to.exist;
        });

      });

    });

  });


  describe('feel popup', function() {

    it('should render feel popup in given container', async function() {

      // given
      const editFieldSpy = spy();

      const field = schema.components.find(({ source }) => source === '=logo');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field,
        services: {
          config: {
            propertiesPanel: {
              feelPopupContainer: container
            }
          }
        }
      });

      const openPopupBtn = findOpenFeelPopup('source', container);

      // when
      await act(() => {
        fireEvent.click(openPopupBtn);
      });

      const feelPopup = domQuery('.bio-properties-panel-feel-popup', container);

      // then
      expect(feelPopup).to.exist;
      expect(feelPopup.parentNode).to.eql(container);
    });

  });


  describe('extension support', function() {

    it('should render configured propertiesPanelEntries', function() {

      // given
      const field = {
        id: 'Custom_1',
        type: 'custom'
      };

      const extension = {
        config: {
          propertiesPanelEntries: [
            'label',
            'description'
          ]
        }
      };

      const formFields = new FormFields();
      formFields.register('custom', extension);

      bootstrapPropertiesPanel({
        container,
        field,
        services: {
          formFields
        }
      });

      // then
      expectGroupEntries(container, 'General', [
        'Field label',
        'Field description'
      ]);

    });


    it('should render configured values groups', function() {

      // given
      const field = {
        id: 'Custom_1',
        type: 'custom',
        values: []
      };

      const extension = {
        config: {
          propertiesPanelEntries: [
            'values'
          ]
        }
      };

      const formFields = new FormFields();
      formFields.register('custom', extension);

      bootstrapPropertiesPanel({
        container,
        field,
        services: {
          formFields
        }
      });

      // then
      expectGroups(container, [
        'Condition',
        'Layout',
        'Options source',
        'Static options',
        'Custom properties'
      ]);

    });


    it('should render from provider', function() {

      // given
      const propertiesProvider = {
        getGroups(element) {
          return (groups) => {

            return [
              ...groups,
              {
                id: 'custom',
                label: 'Custom group',
                entries: []
              }
            ];
          };
        }
      };

      const field = {
        id: 'Custom_1',
        type: 'textfield',
        values: []
      };

      bootstrapPropertiesPanel({
        container,
        field,
        propertiesProviders: [
          propertiesProvider
        ]
      });

      // then
      expectGroups(container, [
        'Condition',
        'Layout',
        'Custom properties',
        'Custom group'
      ]);

    });

  });

});


// helpers //////////////

function createPropertiesPanel({ services, ...restOptions } = {}, renderFn = render) {

  const options = {
    editField: () => {},
    isTemplate: () => false,
    evaluateTemplate: (value) => `Evaluation of "${value}"`,
    valuePaths: {},
    claimedPaths: [],
    propertiesProviders: [],
    field: null,
    ...restOptions
  };

  const defaultedServices = {
    eventBus: new EventBusMock(),
    propertiesPanel: new PropertiesPanelMock(),
    modeling: {
      editFormField(...args) {
        return options.editField(...args);
      }
    },
    ...services
  };

  const injector = createMockInjector(defaultedServices, options);

  const container = options.container;

  const getProviders = () => {
    return [
      new PropertiesProvider(defaultedServices.propertiesPanel, injector),
      ...options.propertiesProviders
    ];
  };

  return renderFn(<PropertiesPanel
    getProviders={ getProviders }
    eventBus={ defaultedServices.eventBus }
    injector={ injector } />,
  {
    container
  });
}


function expectPanelStructure(container, panelStructure) {
  const groupNames = Object.keys(panelStructure);

  expectGroups(container, groupNames);

  groupNames.forEach(group => {
    const entries = panelStructure[group];
    expectGroupEntries(container, group, entries);
  });
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

function findFeelers(id, container) {
  return container.querySelector(`[data-entry-id="${id}"] .bio-properties-panel-feelers-editor`);
}

function findOpenFeelPopup(id, container) {
  return container.querySelector(`[data-entry-id="${id}"] .bio-properties-panel-open-feel-popup`);
}

function findTextbox(id, container) {
  return container.querySelector(`[name=${id}] [role="textbox"]`);
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
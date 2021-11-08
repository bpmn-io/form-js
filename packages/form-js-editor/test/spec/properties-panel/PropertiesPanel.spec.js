import {
  fireEvent,
  render,
  screen
} from '@testing-library/preact/pure';

import PropertiesPanel from '../../../src/render/components/properties-panel/PropertiesPanel';

import { WithFormEditorContext } from './helper';

import schema from '../form.json';
import defaultValues from '../defaultValues.json';

import { insertStyles } from '../../TestHelper';

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
    const result = createPropertiesPanel({ container });

    // then
    expect(result.container.querySelector('.fjs-properties-panel-placeholder')).to.exist;
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

    expect(result.container.querySelector('.fjs-properties-panel-header-type')).to.exist;
    expect(result.container.querySelectorAll('.fjs-properties-panel-group')).to.have.length(2);
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
        'Id'
      ]);
    });


    it('button', function() {

      // given
      const field = schema.components.find(({ key }) => key === 'submit');

      const result = createPropertiesPanel({
        container,
        field
      });

      // then
      expectGroups(result.container, [
        'General'
      ]);

      expectGroupEntries(result.container, 'General', [
        'Field Label',
        'Action'
      ]);
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
          'General'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field Label',
          'Field Description',
          'Key',
          'Default Value',
          'Disabled'
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
          const input = screen.getByLabelText('Default Value');

          expect(input.value).to.equal('');

          // when
          fireEvent.input(input, { target: { value: 'true' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], true);
        });


        it('should remove default value', function() {

          // given
          const editFieldSpy = spy();

          const field = defaultValues.components.find(({ key }) => key === 'approved');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default Value');

          expect(input.value).to.equal('true');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
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
          'Values',
          'Validation'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field Label',
          'Field Description',
          'Key',
          'Default Value',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Values', [
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
          const input = screen.getByLabelText('Default Value');

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

          const field = defaultValues.components.find(({ key }) => key === 'product');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default Value');

          expect(input.value).to.equal('camunda-platform');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
        });

      });


      describe('values', function() {

        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'product');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const addEntry = result.container.querySelector('.fjs-properties-panel-group-header-button-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value',
              value: 'value'
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

          // when
          const removeEntry = result.container.querySelector('.fjs-properties-panel-collapsible-entry-header-remove-entry');

          fireEvent.click(removeEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            field.values[ 1 ]
          ]);
        });

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
          'Values',
          'Validation'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field Label',
          'Field Description',
          'Key',
          'Default Value',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Values', [
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

          const field = schema.components.find(({ key }) => key === 'language');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default Value');

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

          const field = defaultValues.components.find(({ key }) => key === 'language');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default Value');

          expect(input.value).to.equal('english');

          // when
          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'defaultValue' ], undefined);
        });

      });


      describe('values', function() {

        it('should add value', function() {

          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'language');

          const result = createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // when
          const addEntry = result.container.querySelector('.fjs-properties-panel-group-header-button-add-entry');

          fireEvent.click(addEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            ...field.values,
            {
              label: 'Value',
              value: 'value'
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

          // when
          const removeEntry = result.container.querySelector('.fjs-properties-panel-collapsible-entry-header-remove-entry');

          fireEvent.click(removeEntry);

          // then
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'values' ], [
            field.values[ 1 ]
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
          'General'
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
          'Validation'
        ]);

        expectGroupEntries(result.container, 'General', [
          'Field Label',
          'Field Description',
          'Key',
          'Default Value',
          'Disabled'
        ]);

        expectGroupEntries(result.container, 'Validation', [
          'Required',
          'Minimum Length',
          'Maximum Length',
          'Regular Expression Pattern'
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
          const input = screen.getByLabelText('Default Value');

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

          const field = defaultValues.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Default Value');

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
            const input = screen.getByLabelText('Maximum Length');

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
            const input = screen.getByLabelText('Minimum Length');

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
            const input = screen.getByLabelText('Key');

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
            const input = screen.getByLabelText('Key');

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
              services: {
                formFieldRegistry: {
                  _keys: {
                    assigned(key) {
                      return schema.components.find((component) => component.key === key);
                    }
                  }
                }
              }
            });

            // assume
            const input = screen.getByLabelText('Key');

            expect(input.value).to.equal('creditor');

            // when
            fireEvent.input(input, { target: { value: 'amount' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must be unique.');

            expect(error).to.exist;
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

            createPropertiesPanel({
              container,
              editField: editFieldSpy,
              field: schema
            });

            // assume
            const input = screen.getByLabelText('Id');

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
            const input = screen.getByLabelText('Id');

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
            const input = screen.getByLabelText('Id');

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
            const input = screen.getByLabelText('Id');

            expect(input.value).to.equal(schema.id);

            // when
            fireEvent.input(input, { target: { value: '<HELLO>' } });

            // then
            expect(editFieldSpy).not.to.have.been.called;

            const error = screen.getByText('Must be a valid QName.');

            expect(error).to.exist;
          });

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
    field = null,
    services
  } = options;

  return render(WithFormEditorContext(
    <PropertiesPanel
      editField={ editField }
      field={ field } />,
    services
  ), {
    container
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
  const groups = container.querySelectorAll('.fjs-properties-panel-group-header-label');

  return Array.from(groups).find(group => group.textContent === groupLabel);
}

function findEntries(container, groupLabel, entryLabel) {
  const group = findGroup(container, groupLabel);

  if (group) {
    const entries = container.querySelectorAll('.fjs-properties-panel-label');

    return Array.from(entries).filter(entry => entry.textContent === entryLabel);
  }
}
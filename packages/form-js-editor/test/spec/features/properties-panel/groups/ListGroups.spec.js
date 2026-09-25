import { expect } from 'chai';
import * as sinon from 'sinon';
import { act, fireEvent, screen, waitFor } from '@testing-library/preact/pure';

import { query as domQuery } from 'min-dom';
import { set } from 'min-dash';

import { OPTIONS_SOURCES } from '@bpmn-io/form-js-viewer';

import { removeKey } from '../../../../../src/features/properties-panel/groups/CustomPropertiesGroup';

import { EventBusMock } from '../helper/mocks';
import { createPropertiesPanel, findGroup, nextTick } from '../helper';

import schema from '../../../form.json';
import redundantValuesSchema from '../../../redundantValues.json';
import tableSchema from '../../../form-table.json';

const spy = sinon.spy;

describe('ListGroups', function () {
  let parent, container;

  const bootstrapPropertiesPanel = (options) => {
    return act(() => {
      createPropertiesPanel(options);
    });
  };

  beforeEach(function () {
    parent = document.createElement('div');

    parent.classList.add('fjs-container', 'fjs-editor-container');

    container = document.createElement('div');

    container.classList.add('fjs-properties-container');

    container.style.position = 'absolute';
    container.style.right = '0';

    parent.appendChild(container);

    document.body.appendChild(parent);
  });

  afterEach(function () {
    document.body.removeChild(parent);
  });

  describe('static options', function () {
    describe('radio', function () {
      it('should NOT order alphanumerical', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'product');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        // when
        const group = findGroup(container, 'Static options');

        const list = group.querySelector('.bio-properties-panel-list');

        // then
        expect(getListOrdering(list)).to.eql(['Camunda Platform', 'Camunda Cloud']);
      });

      it('should add option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'product');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const addEntry = group.querySelector('.bio-properties-panel-add-entry');

        fireEvent.click(addEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(
          field,
          ['values'],
          [
            ...field.values,
            {
              label: 'Value 3',
              value: 'value3',
            },
          ],
        );
      });

      it('should add option with different index if already used', function () {
        // given
        const editFieldSpy = spy();

        const field = redundantValuesSchema.components.find(({ key }) => key === 'redundantValues');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const addEntry = group.querySelector('.bio-properties-panel-add-entry');
        fireEvent.click(addEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(
          field,
          ['values'],
          [
            ...field.values,
            {
              label: 'Value 4',
              value: 'value4',
            },
          ],
        );
      });

      it('should remove option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'product');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

        fireEvent.click(removeEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(field, ['values'], [field.values[1]]);
      });

      it('should keep option open after edit', function () {
        // given
        const eventBus = new EventBusMock();

        const field = structuredClone(schema.components.find(({ key }) => key === 'product'));

        bootstrapPropertiesPanel({
          container,
          editField: createRerenderingEditField(eventBus),
          field,
          services: { eventBus },
        });

        openListItem(container, 'staticOptions-0');

        // when
        const input = screen.getByLabelText('Label', { selector: '#bio-properties-panel-staticOptions-0-label' });

        fireEvent.input(input, { target: { value: 'Camunda 7' } });

        // then
        expect(isListItemOpen(container, 'staticOptions-0')).to.be.true;
      });

      describe('validation', function () {
        describe('value', function () {
          it('should not be empty', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'product');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
            });

            // when
            const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });

          it('should be unique', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'product');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
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

        describe('label', function () {
          it('should not be empty', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'product');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
            });

            // when
            const input = screen.getByLabelText('Label', { selector: '#bio-properties-panel-staticOptions-0-label' });

            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });

          it('should be unique', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'product');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
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

    describe('checklist', function () {
      it('should add option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'mailto');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const addEntry = group.querySelector('.bio-properties-panel-add-entry');

        fireEvent.click(addEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(
          field,
          ['values'],
          [
            ...field.values,
            {
              label: 'Value 4',
              value: 'value4',
            },
          ],
        );
      });

      it('should remove option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'mailto');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

        fireEvent.click(removeEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(field, ['values'], [field.values[1], field.values[2]]);
      });

      it('should remove option and clear default value if option was default', function () {
        // given
        const editFieldSpy = spy();

        const field = {
          ...schema.components.find(({ key }) => key === 'mailto'),
          defaultValue: 'approver', // Set first option as default
        };

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');
        fireEvent.click(removeEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(field, {
          values: [field.values[1], field.values[2]],
          defaultValue: undefined,
        });
      });

      describe('validation', function () {
        describe('value', function () {
          it('should not be empty', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'mailto');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
            });

            // when
            const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });

          it('should be unique', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'mailto');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
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

    describe('taglist', function () {
      it('should add option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'tags');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const addEntry = group.querySelector('.bio-properties-panel-add-entry');

        fireEvent.click(addEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(
          field,
          ['values'],
          [
            ...field.values,
            {
              label: 'Value 12',
              value: 'value12',
            },
          ],
        );
      });

      it('should remove option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'tags');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

        fireEvent.click(removeEntry);

        // then
        const expectedValues = [...field.values];
        expectedValues.shift();

        expect(editFieldSpy).to.have.been.calledWith(field, ['values'], expectedValues);
      });

      describe('validation', function () {
        describe('value', function () {
          it('should not be empty', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'tags');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
            });

            // when
            const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });

          it('should be unique', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'tags');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
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

    describe('select', function () {
      it('should NOT order alphanumerical', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'language');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        // when
        const group = findGroup(container, 'Static options');

        const list = group.querySelector('.bio-properties-panel-list');

        // then
        expect(getListOrdering(list)).to.eql(['German', 'English']);
      });

      it('should auto focus other entry', async function () {
        // given
        let field = {
          key: 'dri',
          label: 'Assign DRI',
          type: 'select',
          valuesKey: 'queriedDRIs',
        };

        const eventBus = new EventBusMock();

        const editField = () => {
          field = { ...field, values: ['foo'], valuesKey: undefined };
        };

        bootstrapPropertiesPanel({
          container,
          editField,
          field,
          services: {
            eventBus,
            selection: {
              get: () => field,
            },
          },
        });

        // assume
        const input = screen.getByLabelText('Type');
        expect(input.value).to.equal(OPTIONS_SOURCES.INPUT);

        // when
        fireEvent.input(input, { target: { value: OPTIONS_SOURCES.STATIC } });
        await act(() => eventBus.fire('changed'));

        // focus is applied on a deferred `propertiesPanel.showEntry` event; flush it
        await nextTick();

        // then
        await waitFor(() => {
          const optionLabelInput = screen.getByLabelText('Label');
          expect(document.activeElement).to.eql(optionLabelInput);
        });
      });

      it('should add option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'language');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const addEntry = group.querySelector('.bio-properties-panel-add-entry');

        fireEvent.click(addEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(
          field,
          ['values'],
          [
            ...field.values,
            {
              label: 'Value 3',
              value: 'value3',
            },
          ],
        );
      });

      it('should remove option', function () {
        // given
        const editFieldSpy = spy();

        const field = schema.components.find(({ key }) => key === 'language');

        bootstrapPropertiesPanel({
          container,
          editField: editFieldSpy,
          field,
        });

        const group = findGroup(container, 'Static options');

        // when
        const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

        fireEvent.click(removeEntry);

        // then
        expect(editFieldSpy).to.have.been.calledWith(field, ['values'], [field.values[1]]);
      });

      describe('validation', function () {
        describe('value', function () {
          it('should not be empty', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'language');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
            });

            // when
            const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-staticOptions-0-value' });

            fireEvent.input(input, { target: { value: '' } });

            // then
            expect(editFieldSpy).to.not.have.been.called;

            const error = screen.getByText('Must not be empty.');

            expect(error).to.exist;
          });

          it('should be unique', function () {
            // given
            const editFieldSpy = spy();

            const field = schema.components.find(({ key }) => key === 'language');

            bootstrapPropertiesPanel({
              container,
              editField: editFieldSpy,
              field,
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
  });

  describe('header items', function () {
    it('should auto focus other entry', async function () {
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
        get: () => field,
      };

      const editField = () => {
        const { columnsExpression: _, ...renderedField } = field;
        field = {
          ...renderedField,
          columns: [
            {
              label: 'Column',
              key: 'inputVariable',
            },
          ],
        };
      };

      bootstrapPropertiesPanel({
        container,
        editField,
        field,
        services: {
          eventBus,
          selection,
        },
      });

      // assume
      const input = screen.getByLabelText('Type');

      // when
      fireEvent.input(input, { target: { value: 'static' } });
      await act(() => eventBus.fire('changed'));

      // focus is applied on a deferred `propertiesPanel.showEntry` event; flush it
      await nextTick();

      // then
      await waitFor(() => {
        const optionLabelInput = screen.getByLabelText('Label');
        expect(document.activeElement).to.eql(optionLabelInput);
      });
    });

    it('should add value', function () {
      // given
      const editFieldSpy = spy();

      const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field,
      });

      const group = findGroup(container, 'Header items');

      // when
      const addEntry = group.querySelector('.bio-properties-panel-add-entry');

      fireEvent.click(addEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(
        field,
        ['columns'],
        [
          ...field.columns,
          {
            label: 'Column',
            key: 'inputVariable',
          },
        ],
      );
    });

    it('should remove value', function () {
      // given
      const editFieldSpy = spy();

      const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field,
      });

      const group = findGroup(container, 'Header items');

      // when
      const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

      fireEvent.click(removeEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(
        field,
        ['columns'],
        [
          {
            label: 'Name',
            key: 'name',
          },
          {
            label: 'Date',
            key: 'date',
          },
        ],
      );
    });

    it('should keep value open after edit', function () {
      // given
      const eventBus = new EventBusMock();

      const field = structuredClone(tableSchema.components.find(({ label }) => label === 'static-headers-table'));

      const itemId = `${field.id}-columns-0`;

      bootstrapPropertiesPanel({
        container,
        editField: createRerenderingEditField(eventBus),
        field,
        services: { eventBus },
      });

      openListItem(container, itemId);

      // when
      const input = screen.getByLabelText('Label', { selector: `#bio-properties-panel-${itemId}-label` });

      fireEvent.input(input, { target: { value: 'Identifier' } });

      // then
      expect(isListItemOpen(container, itemId)).to.be.true;
    });

    describe('validation', function () {
      describe('key', function () {
        it('should not be empty', function () {
          // given
          const editFieldSpy = spy();

          const field = tableSchema.components.find(({ label }) => label === 'static-headers-table');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field,
          });

          // when
          const input = screen.getByLabelText('Key', {
            selector: `#bio-properties-panel-${field.id}-columns-0-key`,
          });

          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.not.have.been.called;

          const error = screen.getByText('Must not be empty.');

          expect(error).to.exist;
        });
      });
    });
  });

  describe('custom properties', function () {
    it('should add property', function () {
      // given
      const editFieldSpy = spy();

      const field = schema.components.find(({ key }) => key === 'creditor');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field,
      });

      const group = findGroup(container, 'Custom properties');

      // when
      const addEntry = group.querySelector('.bio-properties-panel-add-entry');

      fireEvent.click(addEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, ['properties'], {
        ...field.properties,
        key4: 'value',
      });
    });

    it('should add property with different index if already used', function () {
      // given
      const editFieldSpy = spy();

      const field = redundantValuesSchema.components.find(({ key }) => key === 'redundantValues');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field,
      });

      const group = findGroup(container, 'Custom properties');

      // when
      const addEntry = group.querySelector('.bio-properties-panel-add-entry');
      fireEvent.click(addEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, ['properties'], {
        key2: 'value',
        key3: 'value',
      });
    });

    it('should remove property', function () {
      // given
      const editFieldSpy = spy();

      const field = schema.components.find(({ key }) => key === 'creditor');

      bootstrapPropertiesPanel({
        container,
        editField: editFieldSpy,
        field,
      });

      const group = findGroup(container, 'Custom properties');

      // when
      const removeEntry = group.querySelector('.bio-properties-panel-remove-entry');

      fireEvent.click(removeEntry);

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, ['properties'], {
        ...removeKey(field.properties, 'firstName'),
      });
    });

    it('should keep property open after edit', function () {
      // given
      const eventBus = new EventBusMock();

      const field = structuredClone(schema.components.find(({ key }) => key === 'creditor'));

      bootstrapPropertiesPanel({
        container,
        editField: createRerenderingEditField(eventBus),
        field,
        services: { eventBus },
      });

      openListItem(container, 'property-0');

      // when
      const input = screen.getByLabelText('Value', { selector: '#bio-properties-panel-property-0-value' });

      fireEvent.input(input, { target: { value: 'Jane' } });

      // then
      expect(isListItemOpen(container, 'property-0')).to.be.true;
    });

    describe('validation', function () {
      describe('custom property key', function () {
        it('should not be empty', function () {
          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'creditor');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field,
          });

          // when
          const input = screen.getByLabelText('Key', { selector: '#bio-properties-panel-property-0-key' });

          fireEvent.input(input, { target: { value: '' } });

          // then
          expect(editFieldSpy).to.not.have.been.called;

          const error = screen.getByText('Must not be empty.');

          expect(error).to.exist;
        });

        it('should be unique', function () {
          // given
          const editFieldSpy = spy();

          const field = schema.components.find(({ key }) => key === 'creditor');

          bootstrapPropertiesPanel({
            container,
            editField: editFieldSpy,
            field,
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
});

// helpers //////////

function createRerenderingEditField(eventBus) {
  return (field, path, value) => {
    set(field, [].concat(path), value);

    act(() => eventBus.fire('changed', { elements: [field] }));

    return field;
  };
}

function openListItem(container, id) {
  fireEvent.click(domQuery(`[data-entry-id="${id}"] .bio-properties-panel-collapsible-entry-header`, container));
}

function isListItemOpen(container, id) {
  return domQuery(`[data-entry-id="${id}"]`, container).classList.contains('open');
}

function getListOrdering(list) {
  let ordering = [];

  const items = list.querySelectorAll('.bio-properties-panel-list-item', list);

  items.forEach((item) => {
    const collapsible = item.querySelector('.bio-properties-panel-collapsible-entry', item);

    ordering.push(collapsible.querySelector('.bio-properties-panel-collapsible-entry-header-title').textContent);
  });

  return ordering;
}

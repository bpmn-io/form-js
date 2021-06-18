import { waitFor } from '@testing-library/preact/pure';

import { isUndefined } from 'min-dash';

import { clone } from '@bpmn-io/form-js-viewer';

import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from '../../TestHelper';

import { insertStyles } from '../../TestHelper';

import schema from '../form.json';

insertStyles();


describe('Modeling', function() {

  beforeEach(bootstrapFormEditor(schema));

  beforeEach(async function() {
    await waitFor(inject(function(formFieldRegistry) {
      expect(formFieldRegistry.size).to.equal(11);
    }));
  });

  afterEach(function() {
    getFormEditor().destroy();
  });


  describe('#addFormField', function() {

    const targetIndex = 0;

    const formField = {
      _id: 'foo',
      type: 'button'
    };

    let formFieldIds,
        formFieldsSize;

    beforeEach(inject(function(formFieldRegistry, modeling) {

      // given
      formFieldsSize = formFieldRegistry.size;

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      formFieldIds = parent.components.map(({ _id }) => _id);

      // when
      modeling.addFormField(
        parent,
        targetIndex,
        formField
      );
    }));


    it('<do>', inject(function(formFieldRegistry) {

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize + 1);

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ _id }) => _id)).to.eql([
        formField._id,
        ...formFieldIds
      ]);
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize);

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ _id }) => _id)).to.eql(formFieldIds);
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize + 1);

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ _id }) => _id)).to.eql([
        formField._id,
        ...formFieldIds
      ]);
    }));

  });


  describe('#editFormField', function() {

    let oldFormField;

    beforeEach(inject(function(formFieldRegistry, modeling) {

      // given
      const formField = Array.from(formFieldRegistry.values()).find(({ type }) => type === 'text');

      oldFormField = clone(formField);

      // when
      modeling.editFormField(
        formField,
        'text',
        'foo'
      );
    }));


    it('<do>', inject(function(formFieldRegistry) {

      // then
      expect(formFieldRegistry.get(oldFormField._id)).to.eql({
        ...oldFormField,
        text: 'foo'
      });
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry.get(oldFormField._id)).to.eql({
        ...oldFormField
      });
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formFieldRegistry.get(oldFormField._id)).to.eql({
        ...oldFormField,
        text: 'foo'
      });
    }));

  });


  describe('#moveFormField', function() {

    describe('same parent', function() {

      describe('down', function() {

        const sourceIndex = 0,
              targetIndex = 2;

        let formFieldIds,
            formFieldsSize;

        beforeEach(inject(function(formFieldRegistry, modeling) {

          // given
          formFieldsSize = formFieldRegistry.size;

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          formFieldIds = parent.components.map(({ _id }) => _id);

          // when
          modeling.moveFormField(
            parent,
            parent,
            sourceIndex,
            targetIndex
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          expect(parent.components.map(({ _id }) => _id)).to.eql([
            formFieldIds[ 1 ],
            formFieldIds[ 0 ],
            ...formFieldIds.slice(2)
          ]);
        }));


        it('<undo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          expect(parent.components.map(({ _id }) => _id)).to.eql(formFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          expect(parent.components.map(({ _id }) => _id)).to.eql([
            formFieldIds[ 1 ],
            formFieldIds[ 0 ],
            ...formFieldIds.slice(2)
          ]);
        }));

      });


      describe('up', function() {

        const sourceIndex = 1,
              targetIndex = 0;

        let formFieldIds,
            formFieldsSize;

        beforeEach(inject(function(formFieldRegistry, modeling) {

          // given
          formFieldsSize = formFieldRegistry.size;

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          formFieldIds = parent.components.map(({ _id }) => _id);

          // when
          modeling.moveFormField(
            parent,
            parent,
            sourceIndex,
            targetIndex
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          expect(parent.components.map(({ _id }) => _id)).to.eql([
            formFieldIds[ 1 ],
            formFieldIds[ 0 ],
            ...formFieldIds.slice(2)
          ]);
        }));


        it('<undo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          expect(parent.components.map(({ _id }) => _id)).to.eql(formFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

          expect(parent.components.map(({ _id }) => _id)).to.eql([
            formFieldIds[ 1 ],
            formFieldIds[ 0 ],
            ...formFieldIds.slice(2)
          ]);
        }));

      });

    });

  });


  describe('#removeFormField', function() {

    const sourceIndex = 0;

    let formFieldIds,
        formFieldsSize;

    beforeEach(inject(function(formFieldRegistry, modeling) {

      // given
      formFieldsSize = formFieldRegistry.size;

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      formFieldIds = parent.components.map(({ _id }) => _id);

      // when
      modeling.removeFormField(
        parent,
        sourceIndex
      );
    }));


    it('<do>', inject(function(formFieldRegistry) {

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize - 1);

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ _id }) => _id)).to.eql(formFieldIds.slice(1));
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize);

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ _id }) => _id)).to.eql(formFieldIds);
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize - 1);

      const parent = Array.from(formFieldRegistry.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ _id }) => _id)).to.eql(formFieldIds.slice(1));
    }));

  });

});
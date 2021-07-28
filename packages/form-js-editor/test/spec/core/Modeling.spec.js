import { isUndefined } from 'min-dash';

import { clone } from '@bpmn-io/form-js-viewer';

import {
  bootstrapFormEditor,
  inject
} from '../../TestHelper';

import { insertStyles } from '../../TestHelper';

import schema from '../form.json';

insertStyles();


describe('core/Modeling', function() {

  beforeEach(bootstrapFormEditor(schema));


  describe('#addFormField', function() {

    const targetIndex = 0;

    const formField = {
      id: 'foo',
      type: 'button'
    };

    let parent,
        formFieldIds,
        formFieldsSize;

    beforeEach(inject(function(formFieldRegistry) {

      // given
      formFieldsSize = formFieldRegistry.size;

      parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

      formFieldIds = parent.components.map(({ id }) => id);
    }));


    it('<do>', inject(function(modeling, formFieldRegistry) {

      // when
      const field = modeling.addFormField(
        formField,
        parent,
        targetIndex
      );

      // then
      expect(field.id).to.exist;

      expect(formFieldRegistry.size).to.equal(formFieldsSize + 1);
      expect(formFieldRegistry.get(field.id)).to.equal(field);

      expect(parent.components.map(({ id }) => id)).to.eql([
        formField.id,
        ...formFieldIds
      ]);
    }));


    it('<undo>', inject(function(modeling, commandStack, formFieldRegistry) {

      // given
      const field = modeling.addFormField(
        formField,
        parent,
        targetIndex
      );

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry.get(field.id)).not.to.exist;
      expect(formFieldRegistry.size).to.equal(formFieldsSize);

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
    }));


    it('<redo>', inject(function(modeling, commandStack, formFieldRegistry) {

      // given
      const field = modeling.addFormField(
        formField,
        parent,
        targetIndex
      );

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formFieldRegistry.get(field.id)).to.equal(field);
      expect(formFieldRegistry.size).to.equal(formFieldsSize + 1);

      expect(parent.components.map(({ id }) => id)).to.eql([
        formField.id,
        ...formFieldIds
      ]);
    }));

  });


  describe('#editFormField', function() {

    describe('single property', function() {

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
        expect(formFieldRegistry.get(oldFormField.id)).to.eql({
          ...oldFormField,
          text: 'foo'
        });
      }));


      it('<undo>', inject(function(commandStack, formFieldRegistry) {

        // when
        commandStack.undo();

        // then
        expect(formFieldRegistry.get(oldFormField.id)).to.eql({
          ...oldFormField
        });
      }));


      it('<redo>', inject(function(commandStack, formFieldRegistry) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(formFieldRegistry.get(oldFormField.id)).to.eql({
          ...oldFormField,
          text: 'foo'
        });
      }));

    });


    describe('multiple properties', function() {

      let oldFormField;

      beforeEach(inject(function(formFieldRegistry, modeling) {

        // given
        const formField = Array.from(formFieldRegistry.values()).find(({ key }) => key === 'creditor');

        oldFormField = clone(formField);

        // when
        modeling.editFormField(
          formField,
          {
            key: 'foo',
            label: 'Foo'
          }
        );
      }));


      it('<do>', inject(function(formFieldRegistry) {

        // then
        expect(formFieldRegistry.get(oldFormField.id)).to.eql({
          ...oldFormField,
          key: 'foo',
          label: 'Foo'
        });
      }));


      it('<undo>', inject(function(commandStack, formFieldRegistry) {

        // when
        commandStack.undo();

        // then
        expect(formFieldRegistry.get(oldFormField.id)).to.eql({
          ...oldFormField
        });
      }));


      it('<redo>', inject(function(commandStack, formFieldRegistry) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(formFieldRegistry.get(oldFormField.id)).to.eql({
          ...oldFormField,
          key: 'foo',
          label: 'Foo'
        });
      }));

    });

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

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          const formField = parent.components[ sourceIndex ];

          formFieldIds = parent.components.map(({ id }) => id);

          // when
          modeling.moveFormField(
            formField,
            parent,
            parent,
            sourceIndex,
            targetIndex
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          expect(parent.components.map(({ id }) => id)).to.eql([
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

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          expect(parent.components.map(({ id }) => id)).to.eql([
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

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          const formField = parent.components[ sourceIndex ];

          formFieldIds = parent.components.map(({ id }) => id);

          // when
          modeling.moveFormField(
            formField,
            parent,
            parent,
            sourceIndex,
            targetIndex
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          expect(parent.components.map(({ id }) => id)).to.eql([
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

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.size).to.equal(formFieldsSize);

          const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

          expect(parent.components.map(({ id }) => id)).to.eql([
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

      const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

      const formField = parent.components[ sourceIndex ];

      formFieldIds = parent.components.map(({ id }) => id);

      // when
      modeling.removeFormField(
        formField,
        parent,
        sourceIndex
      );
    }));


    it('<do>', inject(function(formFieldRegistry) {

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize - 1);

      const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds.slice(1));
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize);

      const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formFieldRegistry.size).to.equal(formFieldsSize - 1);

      const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds.slice(1));
    }));

  });

});
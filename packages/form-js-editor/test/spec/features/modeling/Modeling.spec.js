import { clone } from '@bpmn-io/form-js-viewer';

import {
  bootstrapFormEditor,
  insertStyles,
  inject
} from '../../../TestHelper';

import modelingModule from 'src/features/modeling';

import schema from '../../form.json';

insertStyles();


describe('core/Modeling', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      modelingModule
    ]
  }));


  describe('#addFormField', function() {

    const targetIndex = 0;

    const formField = {
      id: 'foo',
      type: 'button'
    };

    let parent,
        formFieldIds,
        formFieldsLength;

    beforeEach(inject(function(formFieldRegistry) {

      // given
      formFieldsLength = formFieldRegistry.getAll().length;

      parent = formFieldRegistry.get('Form_1');

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

      expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength + 1);
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
      expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);
      expect(formFieldRegistry.get(field.id)).not.to.exist;

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
      expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength + 1);
      expect(formFieldRegistry.get(field.id)).to.equal(field);

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
        const formField = formFieldRegistry.get('Text_1');

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
        const formField = formFieldRegistry.get('Textfield_1');

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


    describe('id property', function() {

      it('<do>', inject(function(modeling, formFieldRegistry) {

        // given
        const field = formFieldRegistry.get('Text_1');

        // when
        modeling.editFormField(
          field,
          'id',
          'OtherText'
        );

        // then
        expect(formFieldRegistry.get('Text_1')).not.to.exist;
        expect(formFieldRegistry.get('OtherText')).to.equal(field);
      }));


      it('<undo>', inject(function(commandStack, modeling, formFieldRegistry) {

        // given
        const field = formFieldRegistry.get('Text_1');

        modeling.editFormField(
          field,
          'id',
          'OtherText'
        );

        // when
        commandStack.undo();

        // then
        expect(formFieldRegistry.get('OtherText')).not.to.exist;
        expect(formFieldRegistry.get('Text_1')).to.equal(field);
      }));


      it('<redo>', inject(function(modeling, commandStack, formFieldRegistry) {

        // given
        const field = formFieldRegistry.get('Text_1');

        modeling.editFormField(
          field,
          'id',
          'OtherText'
        );

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(formFieldRegistry.get('Text_1')).not.to.exist;
        expect(formFieldRegistry.get('OtherText')).to.equal(field);
      }));


      // essentially an empty update; still emitted
      // by the form editor though, so it shall work
      it('<do> - update with no change', inject(function(modeling, formFieldRegistry) {

        // given
        const field = formFieldRegistry.get('Text_1');

        // when
        modeling.editFormField(
          field,
          'id',
          'Text_1'
        );

        // then
        expect(formFieldRegistry.get('Text_1')).to.equal(field);
      }));

    });

  });


  describe('#moveFormField', function() {

    describe('same parent', function() {

      describe('down', function() {

        const sourceIndex = 0,
              targetIndex = 2;

        let formFieldIds,
            formFieldsLength;

        beforeEach(inject(function(formFieldRegistry, modeling) {

          // given
          formFieldsLength = formFieldRegistry.getAll().length;

          const parent = formFieldRegistry.get('Form_1');

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
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const parent = formFieldRegistry.get('Form_1');

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
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const parent = formFieldRegistry.get('Form_1');

          expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const parent = formFieldRegistry.get('Form_1');

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
          formFieldsSize = formFieldRegistry.getAll().length;

          const parent = formFieldRegistry.get('Form_1');

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
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsSize);

          const parent = formFieldRegistry.get('Form_1');

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
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsSize);

          const parent = formFieldRegistry.get('Form_1');

          expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsSize);

          const parent = formFieldRegistry.get('Form_1');

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
        formFieldsLength;

    beforeEach(inject(function(formFieldRegistry, modeling) {

      // given
      formFieldsLength = formFieldRegistry.getAll().length;

      const parent = formFieldRegistry.get('Form_1');

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
      expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength - 1);

      const parent = formFieldRegistry.get('Form_1');

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds.slice(1));
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

      const parent = formFieldRegistry.get('Form_1');

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength - 1);

      const parent = formFieldRegistry.get('Form_1');

      expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds.slice(1));
    }));

  });

});
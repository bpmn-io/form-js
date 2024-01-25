import { clone } from '@bpmn-io/form-js-viewer';

import {
  bootstrapFormEditor,
  insertStyles,
  inject
} from '../../../TestHelper';

import { ModelingModule } from 'src/features/modeling';

import schema from '../../form.json';

insertStyles();


describe('features/modeling', function() {

  beforeEach(bootstrapFormEditor(schema, {
    modules: [
      ModelingModule
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


      // this is necessary due to the fact that _parent
      // is not an object reference but rather a plain
      // string *sad*
      it('<do> - updating <_parent> references', inject(function(modeling, formFieldRegistry) {

        // given
        const field = formFieldRegistry.get('Form_1');

        // when
        modeling.editFormField(
          field,
          'id',
          'Form_AAA'
        );

        // then
        expect(formFieldRegistry.get('Form_AAA')).to.equal(field);

        for (const component of field.components) {
          expect(component).to.have.property('_parent', 'Form_AAA');
        }
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


      describe('to row', function() {

        const sourceIndex = 0,
              targetIndex = 2;

        let formFieldIds,
            formFieldsLength,
            sourceRow,
            targetRow;

        beforeEach(inject(function(formFieldRegistry, modeling, formLayouter) {

          // given
          formFieldsLength = formFieldRegistry.getAll().length;

          const parent = formFieldRegistry.get('Form_1');

          const formField = parent.components[ sourceIndex ];
          const otherFormField = parent.components[ targetIndex ];

          sourceRow = formLayouter.getRowForField(formField);
          targetRow = formLayouter.getRowForField(otherFormField);

          formFieldIds = parent.components.map(({ id }) => id);

          // when
          modeling.moveFormField(
            formField,
            parent,
            parent,
            sourceIndex,
            targetIndex,
            sourceRow,
            targetRow
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const parent = formFieldRegistry.get('Form_1');
          const formField = formFieldRegistry.get(formFieldIds[ 0 ]);

          expect(parent.components.map(({ id }) => id)).to.eql([
            formFieldIds[ 1 ],
            formFieldIds[ 0 ],
            ...formFieldIds.slice(2)
          ]);

          expect(formField.layout.row).eql(targetRow.id);
        }));


        it('<undo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const parent = formFieldRegistry.get('Form_1');
          const formField = formFieldRegistry.get(formFieldIds[ 0 ]);

          expect(parent.components.map(({ id }) => id)).to.eql(formFieldIds);
          expect(formField.layout.row).to.eql(sourceRow.id);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const parent = formFieldRegistry.get('Form_1');
          const formField = formFieldRegistry.get(formFieldIds[ 0 ]);

          expect(parent.components.map(({ id }) => id)).to.eql([
            formFieldIds[ 1 ],
            formFieldIds[ 0 ],
            ...formFieldIds.slice(2)
          ]);

          expect(formField.layout.row).eql(targetRow.id);
        }));

      });

    });


    describe('different parent', function() {

      describe('into inner', function() {

        const sourceIndex = 0,
              targetIndex = 0;

        let sourceFormFieldIds,
            targetFormFieldIds,
            formFieldsLength,
            sourceParent,
            targetParent;

        beforeEach(inject(function(formFieldRegistry, modeling) {

          // given
          formFieldsLength = formFieldRegistry.getAll().length;

          sourceParent = formFieldRegistry.get('Form_1');
          targetParent = formFieldRegistry.get('Group_1');

          const formField = sourceParent.components[ sourceIndex ];

          sourceFormFieldIds = sourceParent.components.map(({ id }) => id);
          targetFormFieldIds = targetParent.components.map(({ id }) => id);

          // when
          modeling.moveFormField(
            formField,
            sourceParent,
            targetParent,
            sourceIndex,
            targetIndex
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const sourceParent = formFieldRegistry.get('Form_1');
          const targetParent = formFieldRegistry.get('Group_1');

          expect(sourceParent.components.map(({ id }) => id)).to.eql(sourceFormFieldIds.slice(1));
          expect(targetParent.components.map(({ id }) => id)).to.eql([
            sourceFormFieldIds[ 0 ],
            ...targetFormFieldIds
          ]);
        }));


        it('should NOT set empty row', inject(function(formFieldRegistry) {

          // then
          const formField = formFieldRegistry.get('Text_1');

          expect(formField.layout.row).to.exist;
        }));


        it('<undo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const sourceParent = formFieldRegistry.get('Form_1');
          const targetParent = formFieldRegistry.get('Group_1');

          expect(sourceParent.components.map(({ id }) => id)).to.eql(sourceFormFieldIds);
          expect(targetParent.components.map(({ id }) => id)).to.eql(targetFormFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const sourceParent = formFieldRegistry.get('Form_1');
          const targetParent = formFieldRegistry.get('Group_1');

          expect(sourceParent.components.map(({ id }) => id)).to.eql(sourceFormFieldIds.slice(1));
          expect(targetParent.components.map(({ id }) => id)).to.eql([
            sourceFormFieldIds[ 0 ],
            ...targetFormFieldIds
          ]);

        }));

      });


      describe('into outer', function() {

        const sourceIndex = 0,
              targetIndex = 0;

        let sourceFormFieldIds,
            targetFormFieldIds,
            formFieldsLength,
            sourceParent,
            targetParent;

        beforeEach(inject(function(formFieldRegistry, modeling) {

          // given
          formFieldsLength = formFieldRegistry.getAll().length;

          sourceParent = formFieldRegistry.get('Group_1');
          targetParent = formFieldRegistry.get('Form_1');

          const formField = sourceParent.components[ sourceIndex ];

          sourceFormFieldIds = sourceParent.components.map(({ id }) => id);
          targetFormFieldIds = targetParent.components.map(({ id }) => id);

          // when
          modeling.moveFormField(
            formField,
            sourceParent,
            targetParent,
            sourceIndex,
            targetIndex
          );
        }));


        it('<do>', inject(function(formFieldRegistry) {

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const sourceParent = formFieldRegistry.get('Group_1');
          const targetParent = formFieldRegistry.get('Form_1');

          expect(sourceParent.components.map(({ id }) => id)).to.eql(sourceFormFieldIds.slice(1));
          expect(targetParent.components.map(({ id }) => id)).to.eql([
            sourceFormFieldIds[ 0 ],
            ...targetFormFieldIds
          ]);
        }));


        it('should NOT set empty row', inject(function(formFieldRegistry) {

          // then
          const formField = formFieldRegistry.get('GroupTextfield_1');

          expect(formField.layout.row).to.exist;
        }));


        it('<undo>', inject(function(commandStack, formFieldRegistry) {

          // when
          commandStack.undo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const sourceParent = formFieldRegistry.get('Group_1');
          const targetParent = formFieldRegistry.get('Form_1');

          expect(sourceParent.components.map(({ id }) => id)).to.eql(sourceFormFieldIds);
          expect(targetParent.components.map(({ id }) => id)).to.eql(targetFormFieldIds);
        }));


        it('<redo>', inject(function(commandStack, formFieldRegistry) {


          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);

          const sourceParent = formFieldRegistry.get('Group_1');
          const targetParent = formFieldRegistry.get('Form_1');

          expect(sourceParent.components.map(({ id }) => id)).to.eql(sourceFormFieldIds.slice(1));
          expect(targetParent.components.map(({ id }) => id)).to.eql([
            sourceFormFieldIds[ 0 ],
            ...targetFormFieldIds
          ]);
        }));

      });

    });

  });


  describe('#removeFormField', function() {


    describe('simple field', function() {

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


    describe('group', function() {

      let formFieldIds,
          sourceIndex,
          groupFieldCount,
          formFieldsLength;

      beforeEach(inject(function(formFieldRegistry, modeling) {

        // given
        formFieldsLength = formFieldRegistry.getAll().length;

        const parent = formFieldRegistry.get('Form_1');

        const group = formFieldRegistry.get('Group_1');

        sourceIndex = parent.components.indexOf(group);

        groupFieldCount = group.components.length + 1;

        formFieldIds = parent.components.map(({ id }) => id);

        // when
        modeling.removeFormField(
          group,
          parent,
          sourceIndex
        );
      }));


      it('<do>', inject(function(formFieldRegistry) {

        // then
        expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength - groupFieldCount);

        const parent = formFieldRegistry.get('Form_1');

        expect(parent.components.map(({ id }) => id)).to.eql([
          ...formFieldIds.slice(0, sourceIndex),
          ...formFieldIds.slice(sourceIndex + 1)
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
        expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength - groupFieldCount);

        const parent = formFieldRegistry.get('Form_1');

        expect(parent.components.map(({ id }) => id)).to.eql([
          ...formFieldIds.slice(0, sourceIndex),
          ...formFieldIds.slice(sourceIndex + 1)
        ]);
      }));

    });

  });


  describe('#claimId', function() {

    const formField = {
      id: 'foo',
      key: 'foo',
      type: 'textfield'
    };


    it('<do>', inject(function(formFieldRegistry, modeling) {

      // when
      modeling.claimId(formField, formField.id);

      // then
      expect(formFieldRegistry._ids.assigned(formField.id)).to.equal(formField);
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry, modeling) {

      // given
      modeling.claimId(formField, formField.id);

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry._ids.assigned(formField.id)).to.be.false;
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry, modeling) {

      // given
      modeling.claimId(formField, formField.id);

      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(formFieldRegistry._ids.assigned(formField.id)).to.equal(formField);
    }));

  });


  describe('#unclaimId', function() {

    const formField = {
      id: 'foo',
      key: 'foo',
      type: 'textfield'
    };

    this.beforeEach(inject(function(modeling) {
      modeling.claimId(formField, formField.id);
    }));


    it('<do>', inject(function(formFieldRegistry, modeling) {

      // when
      modeling.unclaimId(formField, formField.id);

      // then
      expect(formFieldRegistry._ids.assigned(formField.id)).to.be.false;
    }));


    it('<undo>', inject(function(commandStack, formFieldRegistry, modeling) {

      // given
      modeling.unclaimId(formField, formField.id);

      // when
      commandStack.undo();

      // then
      expect(formFieldRegistry._ids.assigned(formField.id)).to.equal(formField);
    }));


    it('<redo>', inject(function(commandStack, formFieldRegistry, modeling) {

      // given
      modeling.unclaimId(formField, formField.id);

      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(formFieldRegistry._ids.assigned(formField.id)).to.be.false;
    }));

  });


  describe('#claimKey', function() {

    const formField = {
      id: 'foo',
      key: 'foo',
      type: 'textfield'
    };


    it('<do>', inject(function(pathRegistry, modeling) {

      // when
      modeling.claimKey(formField, formField.key);

      // then
      expect(pathRegistry.canClaimPath([ formField.key ])).to.be.false;
    }));


    it('<undo>', inject(function(commandStack, pathRegistry, modeling) {

      // given
      modeling.claimKey(formField, formField.key);

      // when
      commandStack.undo();

      // then
      expect(pathRegistry.canClaimPath([ formField.key ])).to.be.true;
    }));


    it('<redo>', inject(function(commandStack, pathRegistry, modeling) {

      // given
      modeling.claimKey(formField, formField.key);

      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(pathRegistry.canClaimPath([ formField.key ])).to.be.false;
    }));

  });


  describe('#unclaimKey', function() {

    const formField = {
      id: 'foo',
      key: 'foo',
      type: 'textfield'
    };

    this.beforeEach(inject(function(modeling) {
      modeling.claimKey(formField, formField.key);
    }));


    it('<do>', inject(function(pathRegistry, modeling) {

      // when
      modeling.unclaimKey(formField, formField.key);

      // then
      expect(pathRegistry.canClaimPath([ formField.key ])).to.be.true;
    }));


    it('<undo>', inject(function(commandStack, pathRegistry, modeling) {

      // given
      modeling.unclaimKey(formField, formField.key);

      // when
      commandStack.undo();

      // then
      expect(pathRegistry.canClaimPath([ formField.key ])).to.be.false;
    }));


    it('<redo>', inject(function(commandStack, pathRegistry, modeling) {

      // given
      modeling.unclaimKey(formField, formField.key);

      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(pathRegistry.canClaimPath([ formField.key ])).to.be.true;
    }));

  });

});
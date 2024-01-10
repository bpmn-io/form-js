import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import { ModelingModule } from 'src/features/modeling';

import schema from '../../../form-table.json';

describe('features/modeling - ColumnsSourceBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      ModelingModule
    ]
  }));


  it('should NOT remove columns source properties', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Field_0k6resc1');

    // when
    modeling.editFormField(
      formField,
      'label',
      'foo'
    );

    // then
    expect(formField.columns).to.have.length(3);
  }));


  describe('should remove columns source properties', function() {

    it('execute', inject(function(formFieldRegistry, modeling) {

      // given
      const formField = formFieldRegistry.get('Field_0k6resc1');

      // when
      modeling.editFormField(
        formField,
        'columnsExpression',
        '='
      );

      // then
      expect(formField.columns).to.not.exist;
    }));


    it('undo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('Field_0k6resc1');

      // when
      modeling.editFormField(
        formField,
        'columnsExpression',
        '='
      );

      // when
      commandStack.undo();

      // then
      expect(formField.columns).to.have.length(3);
    }));


    it('redo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('Field_0k6resc1');

      // when
      modeling.editFormField(
        formField,
        'columnsExpression',
        '='
      );

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formField.columns).to.not.exist;
    }));
  });


  describe('should remove columnsExpression', function() {

    it('execute', inject(function(formFieldRegistry, modeling) {

      // given
      const formField = formFieldRegistry.get('Field_0k6resc2');

      // when
      modeling.editFormField(
        formField,
        'columns',
        []
      );

      // then
      expect(formField.columnsExpression).to.not.exist;
    }));


    it('undo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('Field_0k6resc2');

      // when
      modeling.editFormField(
        formField,
        'columns',
        []
      );

      // when
      commandStack.undo();

      // then
      expect(formField.columnsExpression).to.eql('=tableHeaders');
    }));


    it('redo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('Field_0k6resc2');

      // when
      modeling.editFormField(
        formField,
        'columns',
        []
      );

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formField.columnsExpression).to.not.exist;
    }));
  });

});
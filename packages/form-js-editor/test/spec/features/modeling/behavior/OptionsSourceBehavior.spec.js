import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import { ModelingModule } from 'src/features/modeling';

import schema from '../../../defaultValues.json';

describe('features/modeling - OptionsSourceBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      ModelingModule
    ]
  }));


  it('should NOT remove values source properties', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('language');

    // when
    modeling.editFormField(
      formField,
      'label',
      'foo'
    );

    // then
    expect(formField.values).to.have.length(2);
  }));


  describe('should remove other values source properties', function() {

    it('execute', inject(function(formFieldRegistry, modeling) {

      // given
      const formField = formFieldRegistry.get('language');

      // when
      modeling.editFormField(
        formField,
        'valuesKey',
        ''
      );

      // then
      expect(formField.values).to.not.exist;
      expect(formField.valuesExpression).to.not.exist;
    }));


    it('undo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('language');

      // when
      modeling.editFormField(
        formField,
        'valuesKey',
        ''
      );

      // when
      commandStack.undo();

      // then
      expect(formField.values).to.have.length(2);
    }));


    it('redo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('language');

      // when
      modeling.editFormField(
        formField,
        'valuesKey',
        ''
      );

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formField.values).to.not.exist;
      expect(formField.valuesExpression).to.not.exist;
    }));
  });


  describe('should remove default value', function() {

    it('execute', inject(function(formFieldRegistry, modeling) {

      // given
      const formField = formFieldRegistry.get('language');

      // when
      modeling.editFormField(
        formField,
        'valuesExpression',
        '='
      );

      // then
      expect(formField.defaultValue).to.not.exist;
    }));


    it('undo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('language');

      // when
      modeling.editFormField(
        formField,
        'valuesExpression',
        '='
      );

      // when
      commandStack.undo();

      // then
      expect(formField.defaultValue).to.eql('english');
    }));


    it('redo', inject(function(formFieldRegistry, modeling, commandStack) {

      // given
      const formField = formFieldRegistry.get('language');

      // when
      modeling.editFormField(
        formField,
        'valuesExpression',
        '='
      );

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(formField.defaultValue).to.not.exist;
    }));
  });

});
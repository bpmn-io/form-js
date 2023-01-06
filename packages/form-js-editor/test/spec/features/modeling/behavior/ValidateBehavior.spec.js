import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import modelingModule from 'src/features/modeling';

import schema from '../../../form.json';


describe('features/modeling - ValidateBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      modelingModule
    ]
  }));


  it('should NOT remove custom validate properties', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_2');

    // when
    modeling.editFormField(
      formField,
      'validate',
      {
        ...formField.validate,
        minLength: 2
      }
    );

    // then
    const { validate } = formField;

    expect(validate).to.eql({
      pattern: '^C-[0-9]+$',
      minLength: 2
    });
  }));


  it('should remove custom validate properties', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_2');

    // when
    modeling.editFormField(
      formField,
      'validate',
      {
        ...formField.validate,
        validationType: 'email'
      }
    );

    // then
    const { validate } = formField;

    expect(validate.pattern).to.not.exist;
    expect(validate).to.eql({
      validationType: 'email'
    });
  }));


  it('undo', inject(function(formFieldRegistry, modeling, commandStack) {

    // given
    const formField = formFieldRegistry.get('Textfield_2');

    modeling.editFormField(
      formField,
      'validate',
      {
        ...formField.validate,
        validationType: 'email'
      }
    );

    // when
    commandStack.undo();

    // then
    const { validate } = formField;

    expect(validate).to.eql({
      pattern: '^C-[0-9]+$'
    });
  }));


  it('redo', inject(function(formFieldRegistry, modeling, commandStack) {

    // given
    const formField = formFieldRegistry.get('Textfield_2');

    modeling.editFormField(
      formField,
      'validate',
      {
        ...formField.validate,
        validationType: 'email'
      }
    );

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    const { validate } = formField;

    expect(validate.pattern).to.not.exist;
    expect(validate).to.eql({
      validationType: 'email'
    });

  }));

});
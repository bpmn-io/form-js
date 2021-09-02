import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import modelingModule from 'src/features/modeling';

import schema from '../../../form.json';


describe('features/modeling - KeyBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      modelingModule
    ]
  }));


  it('should unclaim key on form field remove', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_1'),
          parent = formFieldRegistry.get('Form_1'),
          sourceIndex = parent.components.indexOf(formField);

    // when
    modeling.removeFormField(
      formField,
      parent,
      sourceIndex
    );

    // then
    expect(formFieldRegistry._keys.assigned(formField.key)).to.be.false;
  }));


  it('should unclaim old key and claim new key on form field edit', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_1');

    // when
    modeling.editFormField(
      formField,
      'key',
      'foo'
    );

    // then
    expect(formFieldRegistry._keys.assigned('creditor')).to.be.false;
    expect(formFieldRegistry._keys.assigned('foo')).to.equal(formField);
  }));

});
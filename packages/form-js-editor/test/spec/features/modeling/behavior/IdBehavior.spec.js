import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import modelingModule from 'src/features/modeling';

import schema from '../../../form.json';


describe('features/modeling - IdBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    modules: [
      modelingModule
    ]
  }));


  it('should unclaim ID on form field remove', inject(function(formFieldRegistry, modeling) {

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
    expect(formFieldRegistry._ids.assigned(formField.id)).to.be.false;
  }));


  it('should unclaim old ID and claim new ID on form field edit', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_1');

    // when
    modeling.editFormField(
      formField,
      'id',
      'foo'
    );

    // then
    expect(formFieldRegistry._ids.assigned('Textfield_1')).to.be.false;
    expect(formFieldRegistry._ids.assigned('foo')).to.equal(formField);
  }));

});
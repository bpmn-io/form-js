import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import { ModelingModule } from 'src/features/modeling';

import schema from '../../../form.json';


describe('features/modeling - KeyBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      ModelingModule
    ]
  }));


  it('should unclaim key on form field remove', inject(function(formFieldRegistry, pathRegistry, modeling) {

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
    expect(pathRegistry.canClaimPath([ formField.key ])).to.be.true;
  }));


  it('should unclaim old key and claim new key on form field edit', inject(function(formFieldRegistry, pathRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_1');

    const oldKey = formField.key;

    // when
    modeling.editFormField(
      formField,
      'key',
      'user.creditor'
    );

    // then
    expect(pathRegistry.canClaimPath([ oldKey ])).to.be.true;
    expect(pathRegistry.canClaimPath([ 'user' ], { isClosed: true })).to.be.false;
    expect(pathRegistry.canClaimPath([ 'user' ])).to.be.true;
    expect(pathRegistry.canClaimPath([ 'user', 'creditor' ])).to.be.false;
  }));

});
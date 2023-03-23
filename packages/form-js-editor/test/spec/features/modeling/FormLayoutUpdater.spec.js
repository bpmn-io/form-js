import {
  bootstrapFormEditor,
  inject
} from '../../../TestHelper';

import modelingModule from 'src/features/modeling';

import schema from '../../form.json';


describe('features/modeling - FormLayoutUpdater', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      modelingModule
    ]
  }));


  it('should update rows', inject(function(formFieldRegistry, modeling) {

    // given
    const formField = formFieldRegistry.get('Textfield_1'),
          otherFormField = formFieldRegistry.get('Text_1'),
          parent = formFieldRegistry.get('Form_1'),
          sourceIndex = parent.components.indexOf(formField);

    // assume
    expect(formField.layout).to.not.exist;

    // when
    modeling.removeFormField(
      otherFormField,
      parent,
      sourceIndex
    );

    // then
    expect(formField.layout).to.exist;
    expect(formField.layout.row).to.be.a.string;
  }));

});
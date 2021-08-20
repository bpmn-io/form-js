import {
  bootstrapFormEditor,
  inject
} from '../../../TestHelper';

import selectionModule from 'src/features/selection';
import modelingModule from 'src/features/modeling';


describe('features/selection', function() {

  const schema = {
    components: [
      {
        id: 'Text_1',
        text: 'Foo',
        type: 'text'
      },
      {
        id: 'Text_2',
        text: 'Bar',
        type: 'text'
      }
    ],
    id: 'Form_1',
    type: 'default'
  };

  beforeEach(bootstrapFormEditor(schema, {
    modules: [
      modelingModule,
      selectionModule
    ]
  }));


  it('should select new form field', inject(
    function(formEditor, modeling, selection) {

      // given
      const attrs = {
        id: 'text3',
        type: 'text',
        text: 'TEXT 3'
      };

      const { schema } = formEditor._getState();

      // when
      const formField = modeling.addFormField(attrs, schema, 0);

      // then
      expect(selection.get()).to.equal(formField);
    }
  ));


  it('should select moved form field', inject(
    function(formEditor, formFieldRegistry, modeling, selection) {

      // given
      const text2 = formFieldRegistry.get('Text_2');

      const { schema } = formEditor._getState();

      // when
      modeling.moveFormField(text2, schema, schema, 1, 0);

      // then
      expect(selection.get()).to.equal(text2);
    }
  ));


  it('should select next form field on remove', inject(
    function(formEditor, formFieldRegistry, modeling, selection) {

      // given
      const text1 = formFieldRegistry.get('Text_1'),
            text2 = formFieldRegistry.get('Text_2');

      const { schema } = formEditor._getState();

      // when
      modeling.removeFormField(text1, schema, 0);

      // then
      expect(selection.get()).to.equal(text2);
    }
  ));


  it('should select previous form field on remove', inject(
    function(formEditor, formFieldRegistry, modeling, selection) {

      // given
      const text1 = formFieldRegistry.get('Text_1'),
            text2 = formFieldRegistry.get('Text_2');

      const { schema } = formEditor._getState();

      // when
      modeling.removeFormField(text2, schema, 1);

      // then
      expect(selection.get()).to.equal(text1);
    }
  ));


  it('should deselect form field on undo', inject(
    function(commandStack, formEditor, modeling, selection) {

      // given
      const attrs = {
        id: 'text3',
        type: 'text',
        text: 'TEXT 3'
      };

      const { schema } = formEditor._getState();

      const formField = modeling.addFormField(attrs, schema, 0);

      // assume
      expect(selection.get()).to.equal(formField);

      // when
      commandStack.undo();

      // then
      expect(selection.get()).to.be.null;
    }
  ));

});
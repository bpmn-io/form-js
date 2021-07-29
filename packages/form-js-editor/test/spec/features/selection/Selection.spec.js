import {
  bootstrapFormEditor,
  inject
} from '../../../TestHelper';

import selectionModule from 'src/features/selection';

const { spy } = sinon;


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
      selectionModule
    ]
  }));


  it('should get and set', inject(
    function(selection, eventBus, formFieldRegistry) {

      // given
      const text1 = formFieldRegistry.get('Text_1');

      // assume
      expect(text1).to.exist;

      expect(selection.get()).not.to.exist;

      // when
      const changedSpy = spy();

      // when
      eventBus.on('selection.changed', function(event) {
        changedSpy(event.selection);
      });

      selection.set(text1);

      // then
      expect(changedSpy).to.have.been.calledOnceWith(text1);

      expect(selection.get()).to.equal(text1);

      // but when
      selection.set(text1);

      // then
      expect(changedSpy).to.have.been.calledOnce;

      // but when
      selection.set(null);

      // then
      expect(changedSpy).to.have.been.calledTwice;
      expect(changedSpy).to.have.been.calledWith(null);

      expect(selection.get()).not.to.exist;
    }
  ));


  it('should toggle', inject(
    function(selection, eventBus, formFieldRegistry) {

      // given
      const text1 = formFieldRegistry.get('Text_1');
      const text2 = formFieldRegistry.get('Text_2');

      // assume
      expect(text1).to.exist;
      expect(text2).to.exist;

      // when
      const changedSpy = spy();

      // when
      eventBus.on('selection.changed', function(event) {
        changedSpy(event.selection);
      });

      selection.toggle(text1);

      // then
      expect(changedSpy).to.have.been.calledOnceWith(text1);

      expect(selection.get()).to.equal(text1);

      // but when
      selection.toggle(text2);

      // then
      expect(changedSpy).to.have.been.calledTwice;
      expect(changedSpy).to.have.been.calledWith(text2);


      // but when
      selection.toggle(text2);

      // then
      expect(changedSpy).to.have.been.calledThrice;
      expect(changedSpy).to.have.been.calledWith(null);

      expect(selection.get()).not.to.exist;
    }
  ));

});
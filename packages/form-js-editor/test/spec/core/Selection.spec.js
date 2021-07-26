import {
  bootstrapFormEditor,
  inject
} from '../../TestHelper';

const { spy } = sinon;


describe('core/Selection', function() {

  const schema = {
    type: 'default',
    components: [
      {
        id: 'text1',
        type: 'text',
        label: 'Text 1',
        text: 'TEXT 1'
      },
      {
        id: 'text2',
        type: 'text',
        label: 'Text 2',
        text: 'TEXT 2'
      }
    ]
  };

  beforeEach(bootstrapFormEditor(schema));


  it('should get and set', inject(
    function(selection, eventBus, formFieldRegistry) {

      // given
      const text1 = formFieldRegistry.get('text1');

      // assume
      expect(text1).to.exist;

      expect(selection.get()).not.to.exist;

      // when
      const changedSpy = spy();

      // when
      eventBus.on('selection.changed', function(event) {
        changedSpy(event.selection);
      });

      selection.set('text1');

      // then
      expect(changedSpy).to.have.been.calledOnceWith('text1');

      expect(selection.get()).to.eq('text1');

      // but when
      selection.set('text1');

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
      const text1 = formFieldRegistry.get('text1');
      const text2 = formFieldRegistry.get('text2');

      // assume
      expect(text1).to.exist;
      expect(text2).to.exist;

      // when
      const changedSpy = spy();

      // when
      eventBus.on('selection.changed', function(event) {
        changedSpy(event.selection);
      });

      selection.toggle('text1');

      // then
      expect(changedSpy).to.have.been.calledOnceWith('text1');

      expect(selection.get()).to.eq('text1');

      // but when
      selection.toggle('text2');

      // then
      expect(changedSpy).to.have.been.calledTwice;
      expect(changedSpy).to.have.been.calledWith('text2');


      // but when
      selection.toggle('text2');

      // then
      expect(changedSpy).to.have.been.calledThrice;
      expect(changedSpy).to.have.been.calledWith(null);

      expect(selection.get()).not.to.exist;
    }
  ));

});
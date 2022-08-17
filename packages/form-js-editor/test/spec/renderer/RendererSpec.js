import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';


describe('renderer', function() {

  beforeEach(bootstrapFormEditor());

  afterEach(function() {
    getFormEditor().destroy();
  });


  function getContainer() {
    return getFormEditor()._container;
  }

  describe('focus handling', function() {

    it('should be focusable', inject(function(formEditor) {

      // given
      var container = getContainer();

      // when
      container.focus();

      // then
      expect(document.activeElement).to.equal(container);
    }));


    describe('<hover>', function() {

      beforeEach(function() {
        document.body.focus();
      });


      it('should focus if body is focused', inject(function(formEditor, eventBus) {

        // given
        var container = getContainer();

        // when
        eventBus.fire('element.hover');

        // then
        expect(document.activeElement).to.equal(container);
      }));


      it('should not scroll on focus', inject(function(canvas, eventBus) {

        // given
        var container = getContainer();

        var clientRect = container.getBoundingClientRect();

        // when
        eventBus.fire('element.hover');

        // then
        expect(clientRect).to.eql(container.getBoundingClientRect());
      }));


      it('should not focus on existing document focus', inject(function(canvas, eventBus) {

        // given
        var inputEl = document.createElement('input');

        document.body.appendChild(inputEl);
        inputEl.focus();

        // assume
        expect(document.activeElement).to.equal(inputEl);

        // when
        eventBus.fire('element.hover');

        // then
        expect(document.activeElement).to.eql(inputEl);
      }));

    });

  });

});
import { JSONEditor } from '../../src/components/JSONEditor';
import { currentCompletions, startCompletion } from '@codemirror/autocomplete';

describe('JSONEditor', function() {

  describe('#setValue', function() {

    it('should accept external change', async function() {

      // given
      const value = '{ "foo": "bar" }';

      // when
      const editor = new JSONEditor();

      // when
      editor.setValue(value);

      // then
      expect(editor.getView().state.doc.toString()).to.equal(value);
    });
  });


  describe('#setVariables', function() {

    it('should set variables', async function() {

      // given
      const editor = new JSONEditor();

      // then
      expect(() => {
        editor.setVariables([
          {
            name: 'Variable1',
            info: 'Written in Service Task',
            detail: 'Process_1'
          },
          {
            name: 'Variable2',
            info: 'Written in Service Task',
            detail: 'Process_1'
          }
        ]);
      }).not.to.throw();
    });


    it('should suggest updated variables', async function() {

      // given
      const value = '';

      const editor = new JSONEditor();

      editor.setValue(value);

      const cm = editor.getView();

      // when
      editor.setVariables([ 'foobar', 'baz' ]);

      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(2);
        expect(completions[0].label).to.have.eql('baz');
      });
    });


    it('should suggest relevant variables', async function() {

      // given
      const value = '{ "foo": "bar" }';

      const editor = new JSONEditor();

      editor.setValue(value);

      const cm = editor.getView();

      // move cursor to the end of foo
      select(cm, 5);

      // when
      editor.setVariables([ 'foobar', 'baz' ]);

      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.have.eql('foobar');
      });
    });


    it('should change suggestion when variables are updated', async function() {

      // given
      const value = '{ "foo": "bar" }';

      const editor = new JSONEditor();

      editor.setValue(value);
      editor.setVariables([ 'foobar', 'baz' ]);

      const cm = editor.getView();

      // move cursor to the end
      select(cm, 5);

      // assume
      startCompletion(cm);
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.eql('foobar');
      });

      // when
      editor.setVariables([ 'foobaz' ]);
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.eql('foobaz');
      });
    });
  });


  describe('autocompletion', function() {

    it('should suggest applicable variables', function(done) {

      // given
      const initalValue = 'fooba';
      const variables = [ 'foobar', 'baz' ];

      const editor = new JSONEditor();
      editor.setValue(initalValue),
      editor.setVariables(variables);

      const cm = editor.getView();

      // move cursor to the end
      select(cm, 5);

      // when
      startCompletion(cm);

      // then
      // update done async
      expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.have.eql('foobar');
        done();
      });

    });

  });

});


// helper //////////////////////

function select(cm, anchor, head = anchor) {
  cm.dispatch({
    selection: {
      anchor,
      head
    }
  });
}

/**
 * Copied over from @bpmn-io/feel-editor.
 */
async function expectEventually(fn) {
  const nextFrame = () => new Promise(resolve => {
    requestAnimationFrame(resolve);
  });

  let e, i = 10;
  do {
    try {
      await nextFrame();
      await fn();
      return;
    } catch (error) {
      e = error;
    }
  } while (i--);

  throw e;
}

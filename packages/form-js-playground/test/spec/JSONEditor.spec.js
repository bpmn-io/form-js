import { JSONEditor } from '../../src/components/JSONEditor';
import { currentCompletions, startCompletion } from '@codemirror/autocomplete';

describe('JSONEditor', function () {
  describe('#setValue', function () {
    it('should accept external change', async function () {
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

  describe('#setVariables', function () {
    it('should set variables', async function () {
      // given
      const editor = new JSONEditor();

      // then
      expect(() => {
        editor.setVariables([
          {
            name: 'Variable1',
            info: 'Written in Service Task',
            detail: 'Process_1',
          },
          {
            name: 'Variable2',
            info: 'Written in Service Task',
            detail: 'Process_1',
          },
        ]);
      }).not.to.throw();
    });

    it('should suggest updated variables', async function () {
      // given
      const value = '{}';

      const editor = new JSONEditor();

      editor.setValue(value);

      const cm = editor.getView();

      select(cm, 1);

      // when
      editor.setVariables(['foobar', 'baz']);

      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(2);
        expect(completions[0].displayLabel).to.have.eql('"baz"');
      });
    });

    it('should suggest relevant variables', async function () {
      // given
      const value = '{ "foo": "bar" }';

      const editor = new JSONEditor();

      editor.setValue(value);

      const cm = editor.getView();

      // move cursor to the end of foo
      select(cm, 5);

      // when
      editor.setVariables(['foobar', 'baz']);

      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.have.eql('foobar');
      });
    });

    it('should change suggestion when variables are updated', async function () {
      // given
      const value = '{ "foo": "bar" }';

      const editor = new JSONEditor();

      editor.setValue(value);
      editor.setVariables(['foobar', 'baz']);

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
      editor.setVariables(['foobaz']);
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(1);
        expect(completions[0].label).to.eql('foobaz');
      });
    });

    it.skip('should add comma after property name completion', async function () {
      // given
      const initialValue = '{"foo": "bar",}';
      const variables = ['amount', 'baz'];

      const editor = new JSONEditor();
      editor.setValue(initialValue);
      editor.setVariables(variables);

      const cm = editor.getView();

      select(cm, 14);

      // when
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(2);

        // Apply the completion (amount)
        completions[0].apply(cm, completions[0], 14, 14);

        // Check that the property was inserted with a comma
        expect(cm.state.doc.toString()).to.equal('{"foo": "bar",\n"amount": ,}');

        // Check that cursor is positioned before the comma
        expect(cm.state.selection.main.head).to.equal(25);
      });
    });
  });

  describe('autocompletion', function () {
    it('should suggest applicable variables', function (done) {
      // given
      const initialValue = '{"fooba"}';
      const variables = ['foobar', 'baz'];

      const editor = new JSONEditor();
      (editor.setValue(initialValue), editor.setVariables(variables));

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

    it('should suggest property completion for empty object', async function () {
      // given
      const initialValue = '{}';
      const variables = ['foobar', 'baz'];

      const editor = new JSONEditor();
      editor.setValue(initialValue);
      editor.setVariables(variables);

      const cm = editor.getView();

      // move cursor between the braces
      select(cm, 1);

      // when
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(2);

        const completionLabels = completions.map(({ label }) => label);
        const completionDisplayLabels = completions.map(({ displayLabel }) => displayLabel);

        expect(completionLabels).to.include('"foobar": ');
        expect(completionLabels).to.include('"baz": ');
        expect(completionDisplayLabels).to.include('"foobar"');
        expect(completionDisplayLabels).to.include('"baz"');
      });
    });

    it.skip('should suggest property value completions', async function () {
      // given
      const initialValue = '{ "prop": }';
      const editor = new JSONEditor();
      editor.setValue(initialValue);

      const cm = editor.getView();

      // move cursor between : and }
      select(cm, 9);

      // when
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(5);

        const labels = completions.map(({ label }) => label);
        const displayLabels = completions.map(({ displayLabel }) => displayLabel);

        expect(labels).to.include('true');
        expect(labels).to.include('false');
        expect(labels).to.include('null');
        expect(labels).to.include('[  ]');
        expect(labels).to.include('{  }');
        expect(displayLabels).to.include('[ .. ]');
        expect(displayLabels).to.include('{ .. }');
      });
    });

    // Find out why it's flaky on the CI: https://github.com/bpmn-io/form-js/issues/1373
    it.skip('should suggest array value completions', async function () {
      // given
      const initialValue = '[ ]';
      const editor = new JSONEditor();
      editor.setValue(initialValue);

      const cm = editor.getView();

      // move cursor between the brackets
      select(cm, 1);

      // when
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(5);

        const labels = completions.map(({ label }) => label);
        const displayLabels = completions.map(({ displayLabel }) => displayLabel);

        expect(labels).to.include('true');
        expect(labels).to.include('false');
        expect(labels).to.include('null');
        expect(labels).to.include('[  ]');
        expect(labels).to.include('{  }');
        expect(displayLabels).to.include('[ .. ]');
        expect(displayLabels).to.include('{ .. }');
      });
    });

    // Find out why it's flaky on the CI: https://github.com/bpmn-io/form-js/issues/1373
    it.skip('should suggest property completion after opening brace', async function () {
      // given
      const initialValue = '{';
      const variables = ['foobar', 'baz'];

      const editor = new JSONEditor();
      editor.setValue(initialValue);
      editor.setVariables(variables);

      const cm = editor.getView();

      // move cursor after the opening brace
      select(cm, 1);

      // when
      startCompletion(cm);

      // then
      await expectEventually(() => {
        const completions = currentCompletions(cm.state);
        expect(completions).to.have.length(2);

        const completionLabels = completions.map(({ label }) => label);
        const completionDisplayLabels = completions.map(({ displayLabel }) => displayLabel);

        expect(completionLabels).to.include('"foobar": ');
        expect(completionLabels).to.include('"baz": ');
        expect(completionDisplayLabels).to.include('"foobar"');
        expect(completionDisplayLabels).to.include('"baz"');
      });
    });
  });
});

// helper //////////////////////

function select(cm, anchor, head = anchor) {
  cm.dispatch({
    selection: {
      anchor,
      head,
    },
  });
}

/**
 * Copied over from @bpmn-io/feel-editor.
 */
async function expectEventually(fn) {
  const nextFrame = () =>
    new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

  let e,
    i = 10;
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

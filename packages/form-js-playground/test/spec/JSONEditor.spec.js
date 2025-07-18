import { act, screen } from '@testing-library/preact';
import { JSONEditor } from '../../src/components/JSONEditor';
import { startCompletion, closeCompletion } from '@codemirror/autocomplete';

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

describe('JSONEditor', function () {
  let container;

  beforeEach(function () {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
  });

  function getEditorContent() {
    const editorNode = screen.getByRole('textbox');
    return editorNode.textContent;
  }

  describe('#setValue', function () {
    it('should accept external change', async function () {
      // given
      const value = '{ "foo": "bar" }';
      const editor = new JSONEditor();

      // when
      await act(() => {
        editor.attachTo(container);
        editor.setValue(value);
      });

      // then
      expect(getEditorContent()).to.equal(value);
    });
  });

  describe('#setVariables', function () {
    it('should set variables', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
      });

      // then
      await act(() => {
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
    });

    it('should suggest updated variables', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{}');
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 1 } });
        editor.setVariables(['foobar', 'baz']);
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(2);
      expect(options[0].textContent).to.equal('"baz"');
    });

    it('should suggest relevant variables', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{ "foo": "bar" }');
        editor.setVariables(['foobar', 'baz']);
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 5 } }); // after "foo"
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(1);
      expect(options[0].textContent).to.equal('foobar');
    });

    it('should change suggestion when variables are updated', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{ "foo": "bar" }');
        editor.setVariables(['foobar', 'baz']);
      });

      const cm = editor.getView();

      await act(() => {
        cm.dispatch({ selection: { anchor: 5 } });
        startCompletion(cm);
      });

      await screen.findByRole('listbox');

      // when
      await act(() => {
        closeCompletion(cm);
        editor.setVariables(['foobaz']);
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(1);
      expect(options[0].textContent).to.equal('foobaz');
    });

    it.skip('should add comma after property name completion', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{"foo": "bar",}');
        editor.setVariables(['amount', 'baz']);
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 14 } });
        startCompletion(cm);
      });

      const option = await screen.findByText('"amount"');

      await act(() => {
        option.click();
      });

      // then
      expect(getEditorContent()).to.equal('{"foo": "bar","amount": ,}');
      expect(cm.state.selection.main.head).to.equal(24);
    });
  });

  describe('autocompletion', function () {
    it('should suggest applicable variables', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{"fooba"}');
        editor.setVariables(['foobar', 'baz']);
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 7 } });
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(1);
      expect(options[0].textContent).to.equal('foobar');
    });

    it('should suggest property completion for empty object', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{}');
        editor.setVariables(['foobar', 'baz']);
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 1 } });
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(2);
      const labels = Array.from(options).map((o) => o.textContent);
      expect(labels).to.include('"foobar"');
      expect(labels).to.include('"baz"');
    });

    it.skip('should suggest property value completions', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{ "prop": }');
      });

      const cm = editor.getView();

      // when
      await act(async () => {
        cm.dispatch({ selection: { anchor: 9 } });
        cm.focus();
        await nextFrame();
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(5);
      const labels = Array.from(options).map((o) => o.textContent);
      expect(labels).to.eql(['true', 'false', 'null', '[ .. ]', '{ .. }']);
    });

    it('should suggest array value completions', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('[ ]');
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 1 } });
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(5);
      const labels = Array.from(options).map((o) => o.textContent);
      expect(labels).to.eql(['true', 'false', 'null', '[ .. ]', '{ .. }']);
    });

    it('should suggest property completion after opening brace', async function () {
      // given
      const editor = new JSONEditor();
      await act(() => {
        editor.attachTo(container);
        editor.setValue('{');
        editor.setVariables(['foobar', 'baz']);
      });

      const cm = editor.getView();

      // when
      await act(() => {
        cm.dispatch({ selection: { anchor: 1 } });
        startCompletion(cm);
      });

      // then
      const list = await screen.findByRole('listbox');
      const options = list.querySelectorAll('li');
      expect(options).to.have.length(2);
      const labels = Array.from(options).map((o) => o.textContent);
      expect(labels).to.include('"foobar"');
      expect(labels).to.include('"baz"');
    });
  });
});

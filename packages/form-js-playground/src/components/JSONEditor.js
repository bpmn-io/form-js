import mitt from 'mitt';
import { basicSetup } from 'codemirror';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { lintGutter, linter } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { indentWithTab } from '@codemirror/commands';
import { autocompletionExtension } from './autocompletion/index';
import { variablesFacet } from './autocompletion/VariablesFacet';
import { classes as domClasses } from 'min-dom';

const NO_LINT_CLS = 'fjs-cm-no-lint';

/**
 * @param {object} options
 * @param {boolean} [options.readonly]
 * @param {object} [options.contentAttributes]
 * @param {string | HTMLElement} [options.placeholder]
 */
export function JSONEditor(options = {}) {
  const { contentAttributes = {}, placeholder: editorPlaceholder, readonly = false } = options;
  const emitter = mitt();

  const languageCompartment = new Compartment().of(json());
  const tabSizeCompartment = new Compartment().of(EditorState.tabSize.of(2));
  const autocompletionConfCompartment = new Compartment();
  const placeholderLinterExtension = createPlaceholderLinterExtension();

  let container = null;

  function createState(doc, variables = []) {
    const extensions = [
      basicSetup,
      languageCompartment,
      tabSizeCompartment,
      lintGutter(),
      linter(jsonParseLinter()),
      placeholderLinterExtension,
      autocompletionConfCompartment.of(variablesFacet.of(variables)),
      autocompletionExtension(),
      keymap.of([ indentWithTab ]),
      editorPlaceholder ? placeholder(editorPlaceholder) : [],
      EditorState.readOnly.of(readonly),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          emitter.emit('changed', { value: update.state.doc.toString() });
        }
      }),
      EditorView.contentAttributes.of(contentAttributes)
    ];

    return EditorState.create({ doc, extensions });
  }

  const view = new EditorView({
    state: createState('')
  });

  this.setValue = function(newValue) {
    const oldValue = view.state.doc.toString();

    const diff = findDiff(oldValue, newValue);

    if (diff) {
      view.dispatch({
        changes: { from: diff.start, to: diff.end, insert: diff.text },
        selection: { anchor: diff.start + diff.text.length }
      });
    }
  };

  this.getValue = function() {
    return view.state.doc.toString();
  };

  this.setVariables = function(variables) {
    view.dispatch({ effects: autocompletionConfCompartment.reconfigure(variablesFacet.of(variables)) });
  };

  this.getView = function() {
    return view;
  };

  this.on = emitter.on;
  this.off = emitter.off;
  this.emit = emitter.emit;

  this.attachTo = function(_container) {
    container = _container;
    container.appendChild(view.dom);
    domClasses(container, document.body).add('fjs-json-editor');
  };

  this.destroy = function() {
    if (container && view.dom) {
      container.removeChild(view.dom);
      domClasses(container, document.body).remove('fjs-json-editor');
    }
    view.destroy();
  };

  function createPlaceholderLinterExtension() {
    return linter(view => {
      const placeholders = view.dom.querySelectorAll('.cm-placeholder');
      if (placeholders.length > 0) {
        domClasses(container, document.body).add(NO_LINT_CLS);
      } else {
        domClasses(container, document.body).remove(NO_LINT_CLS);
      }
      return [];
    });
  }
}

function findDiff(oldStr, newStr) {

  if (oldStr === newStr) {
    return null;
  }

  oldStr = oldStr || '';
  newStr = newStr || '';

  let minLength = Math.min(oldStr.length, newStr.length);
  let start = 0;

  while (start < minLength && oldStr[start] === newStr[start]) {
    start++;
  }

  if (start === minLength) {
    return {
      start: start,
      text: newStr.slice(start),
      end: oldStr.length
    };
  }

  let endOld = oldStr.length;
  let endNew = newStr.length;

  while (endOld > start && endNew > start && oldStr[endOld - 1] === newStr[endNew - 1]) {
    endOld--;
    endNew--;
  }

  return {
    start: start,
    text: newStr.slice(start, endNew),
    end: endOld
  };
}

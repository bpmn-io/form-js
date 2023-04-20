import mitt from 'mitt';

import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { lintGutter, linter } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { indentWithTab } from '@codemirror/commands';

import autocompletion from './autocompletion/index';
import { variablesFacet } from './autocompletion/VariablesFacet';


export function JSONEditor(options = {}) {
  const {
    readonly = false,
    contentAttributes = {}
  } = options;

  const emitter = mitt();

  let language = new Compartment().of(json());
  let tabSize = new Compartment().of(EditorState.tabSize.of(2));


  /**
   * @typedef {Array<string>} Variables
   */

  const autocompletionConf = new Compartment();

  const linterExtension = linter(jsonParseLinter());

  function createState(doc, extensions = [], variables = []) {
    return EditorState.create({
      doc,
      extensions: [
        basicSetup,
        language,
        tabSize,
        linterExtension,
        lintGutter(),
        autocompletionConf.of(variablesFacet.of(variables)),
        autocompletion(),
        keymap.of([ indentWithTab ]),
        ...extensions
      ]
    });
  }

  function createView(readonly) {

    const updateListener = EditorView.updateListener.of(update => {
      if (update.docChanged) {
        emitter.emit('changed', {
          value: update.view.state.doc.toString()
        });
      }
    });

    const editable = EditorView.editable.of(!readonly);

    const contentAttributesExtension = EditorView.contentAttributes.of(contentAttributes);

    const view = new EditorView({
      state: createState('', [ updateListener, editable, contentAttributesExtension ])
    });

    view.setValue = function(value) {
      this.setState(createState(value, [ updateListener, editable, contentAttributesExtension ]));
    };

    view.setVariables = function(variables) {
      this.setState(createState(
        view.state.doc.toString(),
        [ updateListener, editable, contentAttributesExtension ],
        variables
      ));
    };

    return view;
  }

  const view = this._view = createView(readonly);

  this.setValue = function(value) {
    view.setValue(value);
  };

  this.getValue = function() {
    return view.state.doc.toString();
  };

  /**
   * @param {Variables} variables
   */
  this.setVariables = function(variables) {
    view.setVariables(variables);
  };

  this.on = emitter.on;
  this.off = emitter.off;
  this.emit = emitter.emit;

  this.attachTo = function(container) {
    container.appendChild(view.dom);
  };

  this.destroy = function() {
    if (view.dom.parentNode) {
      view.dom.parentNode.removeChild(view.dom);
    }

    view.destroy();
  };
}

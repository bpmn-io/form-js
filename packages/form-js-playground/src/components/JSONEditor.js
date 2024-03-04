import mitt from 'mitt';

import { basicSetup } from 'codemirror';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { lintGutter, linter } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { indentWithTab } from '@codemirror/commands';
import { autocompletionExtension } from './autocompletion/index';
import { variablesFacet } from './autocompletion/VariablesFacet';

import {
  classes as domClasses
} from 'min-dom';

const NO_LINT_CLS = 'fjs-cm-no-lint';


/**
 * @param {object} options
 * @param {boolean} [options.readonly]
 * @param {object} [options.contentAttributes]
 * @param {string | HTMLElement} [options.placeholder]
 */
export function JSONEditor(options = {}) {
  const {
    contentAttributes = {},
    placeholder: editorPlaceholder,
    readonly = false,
  } = options;

  const emitter = mitt();

  let language = new Compartment().of(json());
  let tabSize = new Compartment().of(EditorState.tabSize.of(2));

  let container = null;


  /**
   * @typedef {Array<string>} Variables
   */

  const autocompletionConf = new Compartment();

  const linterExtension = linter(jsonParseLinter());

  // this sets no-linting mode if placeholders are present
  const placeholderLinterExtension = linter(view => {
    const placeholders = view.dom.querySelectorAll('.cm-placeholder');

    if (placeholders.length > 0) {
      set(container, NO_LINT_CLS);
    } else {
      unset(container, NO_LINT_CLS);
    }

    return [];
  });

  function createState(doc, extensions = [], variables = []) {
    return EditorState.create({
      doc,
      extensions: [
        basicSetup,
        language,
        tabSize,
        linterExtension,
        placeholderLinterExtension,
        lintGutter(),
        autocompletionConf.of(variablesFacet.of(variables)),
        autocompletionExtension(),
        keymap.of([ indentWithTab ]),
        editorPlaceholder ? placeholder(editorPlaceholder) : [],
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

  this.attachTo = function(_container) {
    container = _container;
    container.appendChild(view.dom);
    set(container, 'fjs-json-editor');
  };

  this.destroy = function() {
    if (container && view.dom) {
      container.removeChild(view.dom);
      unset(container, 'fjs-json-editor');
    }

    view.destroy();
  };
}

// helpers //////////////////////


function set(node, cls) {
  const classes = domClasses(node, document.body);
  classes.add(cls);
}

function unset(node, cls) {
  const classes = domClasses(node, document.body);
  classes.remove(cls);
}

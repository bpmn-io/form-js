import mitt from 'mitt';

import { basicSetup, EditorView } from '@codemirror/basic-setup';
import { EditorState, Compartment } from '@codemirror/state';
import { json } from '@codemirror/lang-json';


export default function JSONEditor(options = {}) {

  const emitter = mitt();

  const {
    readonly = false
  } = options;

  let language = new Compartment().of(json());
  let tabSize = new Compartment().of(EditorState.tabSize.of(2));

  function createState(doc, extensions=[]) {
    return EditorState.create({
      doc,
      extensions: [
        basicSetup,
        language,
        tabSize,
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

    const view = new EditorView({
      state: createState('', [ updateListener, editable ])
    });

    view.setValue = function(value) {
      this.setState(createState(value, [ updateListener, editable ]));
    };

    return view;
  }

  const view = createView(readonly);

  this.setValue = function(value) {
    view.setValue(value);
  };

  this.getValue = function() {
    return view.state.doc.toString();
  };

  this.on = emitter.on;
  this.off = emitter.off;

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

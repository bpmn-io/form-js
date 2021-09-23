import JSONView from './JSONView';

import { render } from 'preact';

import { useRef, useEffect, useState, useCallback } from 'preact/hooks';

import fileDrop from 'file-drops';

import mitt from 'mitt';

import download from 'downloadjs';

import {
  Form,
  FormEditor
} from '@bpmn-io/form-js';

import './FileDrop.css';
import './Playground.css';


function Modal(props) {

  useEffect(() => {
    function handleKey(event) {

      if (event.key === 'Escape') {
        event.stopPropagation();

        props.onClose();
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  });

  return (
    <div class="fjs-pgl-modal">
      <div class="fjs-pgl-modal-backdrop" onClick={ props.onClose }></div>
      <div class="fjs-pgl-modal-content">
        <h1 class="fjs-pgl-modal-header">{ props.name }</h1>
        <div class="fjs-pgl-modal-body">
          { props.children }
        </div>
        <div class="fjs-pgl-modal-footer">
          <button class="fjs-pgl-button fjs-pgl-button-default" onClick={ props.onClose }>Close</button>
        </div>
      </div>
    </div>
  );
}

function Section(props) {

  const elements =
    Array.isArray(props.children)
      ? props.children :
      [ props.children ];

  const {
    headerItems,
    children
  } = elements.reduce((_, child) => {
    const bucket =
      child.type === Section.HeaderItem
        ? _.headerItems
        : _.children;

    bucket.push(child);

    return _;
  }, { headerItems: [], children: [] });

  return (
    <div class="fjs-pgl-section">
      <h1 class="header">{ props.name } { headerItems.length ? <span class="header-items">{ headerItems }</span> : null }</h1>
      <div class="body">
        { children }
      </div>
    </div>
  );
}

Section.HeaderItem = function(props) {
  return props.children;
};

function serializeValue(obj) {
  return JSON.stringify(JSON.stringify(obj)).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function EmbedModal(props) {

  const schema = serializeValue(props.schema);
  const data = serializeValue(props.data || {});

  const fieldRef = useRef();

  const snippet = `<!-- styles needed for rendering -->
<link rel="stylesheet" href="https://unpkg.com/@bpmn-io/form-js@0.2.4/dist/assets/form-js.css">

<!-- container to render the form into -->
<div class="fjs-pgl-form-container"></div>

<!-- scripts needed for embedding -->
<script src="https://unpkg.com/@bpmn-io/form-js@0.2.4/dist/form-viewer.umd.js"></script>

<!-- actual script to instantiate the form and load form schema + data -->
<script>
  const data = JSON.parse(${data});
  const schema = JSON.parse(${schema});

  const form = new FormViewer.Form({
    container: document.querySelector(".fjs-pgl-form-container")
  });

  form.on("submit", (event) => {
    console.log(event.data, event.errors);
  });

  form.importSchema(schema, data).catch(err => {
    console.error("Failed to render form", err);
  });
</script>
  `.trim();

  useEffect(() => {
    fieldRef.current.select();
  });

  return (
    <Modal name="Embed form" onClose={ props.onClose }>
      <p>Use the following HTML snippet to embed your form with <a href="https://github.com/bpmn-io/form-js">form-js</a>:</p>

      <textarea spellCheck="false" ref={ fieldRef }>{snippet}</textarea>
    </Modal>
  );
}

function PlaygroundRoot(props) {

  const editorContainerRef = useRef();
  const formContainerRef = useRef();
  const dataContainerRef = useRef();
  const resultContainerRef = useRef();

  const formEditorRef = useRef();
  const formRef = useRef();
  const dataEditorRef = useRef();
  const resultViewRef = useRef();

  const [ showEmbed, setShowEmbed ] = useState(false);

  const [ initialData ] = useState(props.data || {});
  const [ initialSchema, setInitialSchema ] = useState(props.schema);

  const [ data, setData ] = useState(props.data || {});
  const [ schema, setSchema ] = useState(props.schema);

  const [ resultData, setResultData ] = useState(props.data || {});

  useEffect(() => {
    props.onInit({
      setSchema: setInitialSchema
    });
  });

  useEffect(() => {
    setInitialSchema(props.schema || {});
  }, [ props.schema ]);

  useEffect(() => {
    const dataEditor = dataEditorRef.current = new JSONView({
      value: toJSON(data)
    });

    const resultView = resultViewRef.current = new JSONView({
      readonly: true,
      value: toJSON(resultData)
    });

    const form = formRef.current = new Form();
    const formEditor = formEditorRef.current = new FormEditor({
      renderer: {
        compact: true
      }
    });

    formEditor.on('changed', () => {
      setSchema(formEditor.getSchema());
    });

    form.on('changed', event => {
      setResultData(event.data);
    });

    dataEditor.on('changed', event => {
      try {
        setData(JSON.parse(event.value));
      } catch (err) {

        // TODO(nikku): indicate JSON parse error
      }
    });

    const formContainer = formContainerRef.current;
    const editorContainer = editorContainerRef.current;
    const dataContainer = dataContainerRef.current;
    const resultContainer = resultContainerRef.current;

    dataEditor.attachTo(dataContainer);
    resultView.attachTo(resultContainer);
    form.attachTo(formContainer);
    formEditor.attachTo(editorContainer);

    return () => {
      dataEditor.destroy();
      resultView.destroy();
      form.destroy();
      formEditor.destroy();
    };
  }, []);

  useEffect(() => {
    dataEditorRef.current.setValue(toJSON(initialData));
  }, [ initialData ]);

  useEffect(() => {
    formEditorRef.current.importSchema(initialSchema);
  }, [ initialSchema ]);

  useEffect(() => {
    formRef.current.importSchema(schema, data);
  }, [ schema, data ]);

  useEffect(() => {
    resultViewRef.current.setValue(toJSON(resultData));
  }, [ resultData ]);

  useEffect(() => {
    props.onStateChanged({
      schema,
      data
    });
  }, [ schema, data ]);

  const handleDownload = useCallback(() => {

    download(JSON.stringify(schema, null, '  '), 'form.json', 'text/json');
  }, [ schema ]);

  const hideEmbedModal = useCallback(() => {
    setShowEmbed(false);
  }, []);

  const showEmbedModal = useCallback(() => {
    setShowEmbed(true);
  }, []);

  return (
    <div class="fjs-pgl-root">
      <div class="fjs-pgl-modals">
        { showEmbed ? <EmbedModal schema={ schema } data={ data } onClose={ hideEmbedModal } /> : null }
      </div>
      <div class="fjs-pgl-main">

        <Section name="Form Definition">
          <Section.HeaderItem>
            <button
              class="fjs-pgl-button"
              title="Download form definition"
              onClick={ handleDownload }
            >Download</button>
          </Section.HeaderItem>
          <Section.HeaderItem>
            <button
              class="fjs-pgl-button"
              onClick={ showEmbedModal }
            >Embed</button>
          </Section.HeaderItem>
          <div ref={ editorContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Preview">
          <div ref={ formContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Data (Input)">
          <div ref={ dataContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
        <Section name="Form Data (Submit)">
          <div ref={ resultContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
      </div>
    </div>
  );
}


export default function Playground(options) {

  const {
    container: parent,
    schema,
    data
  } = options;

  const emitter = mitt();

  let state = { data, schema };
  let ref;

  const container = document.createElement('div');

  container.classList.add('fjs-pgl-parent');

  parent.appendChild(container);

  const handleDrop = fileDrop('Drop a form file', function(files) {
    const file = files[0];

    if (file) {
      try {
        ref.setSchema(JSON.parse(file.contents));
      } catch (err) {

        // TODO(nikku): indicate JSON parse error
      }
    }
  });

  container.addEventListener('dragover', handleDrop);

  render(
    <PlaygroundRoot
      schema={ schema }
      data={ data }
      onStateChanged={ (_state) => state = _state }
      onInit={ _ref => ref = _ref }
    />,
    container
  );

  this.on = emitter.on;
  this.off = emitter.off;

  this.emit = emitter.emit;

  this.on('destroy', function() {
    render(null, container);
  });

  this.on('destroy', function() {
    parent.removeChild(container);
  });

  this.getState = function() {
    return state;
  };

  this.setSchema = function(schema) {
    return ref.setSchema(schema);
  };

  this.destroy = function() {
    this.emit('destroy');
  };
}


function toJSON(obj) {
  return JSON.stringify(obj, null, '  ');
}
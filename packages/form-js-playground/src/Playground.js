import JSONView from './JSONView';

import { render } from 'preact';

import { useRef, useEffect, useState, useCallback } from 'preact/hooks';

import download from 'downloadjs';

import {
  Form,
  FormEditor
} from '@bpmn-io/form-js';

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
    <div class="section">
      <h1 class="header">{ props.name } { headerItems.length && <span class="header-items">{ headerItems }</span> }</h1>
      <div class="body">
        { children }
      </div>
    </div>
  );
}

Section.HeaderItem = function(props) {
  return props.children;
};

function AppRoot(props) {

  const editorContainerRef = useRef();
  const formContainerRef = useRef();
  const dataContainerRef = useRef();
  const resultContainerRef = useRef();

  const formEditorRef = useRef();
  const formRef = useRef();
  const dataEditorRef = useRef();
  const resultViewRef = useRef();

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
    const formEditor = formEditorRef.current = new FormEditor();

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

  return (
    <div class="app-root">
      <Section name="Form Definition">
        <Section.HeaderItem>
          <button onClick={ handleDownload }>Download</button>
        </Section.HeaderItem>
        <div ref={ editorContainerRef } class="form-container"></div>
      </Section>
      <Section name="Form Preview">
        <Section.HeaderItem>
          <button>Embed</button>
        </Section.HeaderItem>
        <div ref={ formContainerRef } class="form-container"></div>
      </Section>
      <Section name="Form Data (Input)">
        <div ref={ dataContainerRef } class="text-container"></div>
      </Section>
      <Section name="Form Data (Submit)">
        <div ref={ resultContainerRef } class="text-container"></div>
      </Section>
    </div>
  );
}


export default function Playground(options) {

  const {
    container,
    schema,
    data
  } = options;

  let state = { data, schema };
  let ref;

  this.view = render(
    <AppRoot
      schema={ schema }
      data={ data }
      onStateChanged={ (_state) => state = _state }
      onInit={ _ref => ref = _ref }
    />,
    container
  );

  this.getState = function() {
    return state;
  };

  this.setSchema = function(schema) {
    return ref.setSchema(schema);
  };

}


function toJSON(obj) {
  return JSON.stringify(obj, null, '  ');
}
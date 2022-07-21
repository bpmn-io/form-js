import { useRef, useEffect, useState, useCallback } from 'preact/hooks';

import download from 'downloadjs';

import {
  Form,
  FormEditor
} from '@bpmn-io/form-js';

import { EmbedModal } from './EmbedModal';
import { JSONEditor } from './JSONEditor';
import { Section } from './Section';


import './FileDrop.css';
import './PlaygroundRoot.css';


export function PlaygroundRoot(props) {

  const paletteContainerRef = useRef();
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
    const dataEditor = dataEditorRef.current = new JSONEditor({
      value: toJSON(data)
    });

    const resultView = resultViewRef.current = new JSONEditor({
      readonly: true,
      value: toJSON(resultData)
    });

    const form = formRef.current = new Form();
    const formEditor = formEditorRef.current = new FormEditor({
      renderer: {
        compact: true
      },
      palette: {
        parent: paletteContainerRef.current
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
    <div class="fjs-container fjs-pgl-root">
      <div class="fjs-pgl-modals">
        { showEmbed ? <EmbedModal schema={ schema } data={ data } onClose={ hideEmbedModal } /> : null }
      </div>
      <div class="fjs-pgl-palette-container" ref={ paletteContainerRef } />
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


// helpers ///////////////

function toJSON(obj) {
  return JSON.stringify(obj, null, '  ');
}
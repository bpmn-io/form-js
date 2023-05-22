import { useRef, useEffect, useState, useCallback } from 'preact/hooks';

import download from 'downloadjs';

import classNames from 'classnames';

import {
  Form,
  getSchemaVariables
} from '@bpmn-io/form-js-viewer';

import {
  FormEditor
} from '@bpmn-io/form-js-editor';

import { EmbedModal } from './EmbedModal';
import { JSONEditor } from './JSONEditor';
import { Section } from './Section';


import './FileDrop.css';
import './PlaygroundRoot.css';


export function PlaygroundRoot(props) {

  const {
    actions: actionsConfig = {},
    emit,
    exporter: exporterConfig = {},
    viewerProperties = {},
    editorProperties = {},
    viewerAdditionalModules = [],
    editorAdditionalModules = []
  } = props;

  const {
    display: displayActions = true
  } = actionsConfig;

  const paletteContainerRef = useRef();
  const editorContainerRef = useRef();
  const formContainerRef = useRef();
  const dataContainerRef = useRef();
  const resultContainerRef = useRef();
  const propertiesPanelContainerRef = useRef();

  const paletteRef = useRef();
  const formEditorRef = useRef();
  const formRef = useRef();
  const dataEditorRef = useRef();
  const resultViewRef = useRef();
  const propertiesPanelRef = useRef();

  const [ showEmbed, setShowEmbed ] = useState(false);

  const [ initialData ] = useState(props.data || {});
  const [ initialSchema, setInitialSchema ] = useState(props.schema);

  const [ data, setData ] = useState(props.data || {});
  const [ schema, setSchema ] = useState(props.schema);

  const [ resultData, setResultData ] = useState({});

  // pipe to playground API
  useEffect(() => {
    props.onInit({
      attachDataContainer: (node) => dataEditorRef.current.attachTo(node),
      attachEditorContainer: (node) => formEditorRef.current.attachTo(node),
      attachFormContainer: (node) => formRef.current.attachTo(node),
      attachPaletteContainer: (node) => paletteRef.current.attachTo(node),
      attachPropertiesPanelContainer: (node) => propertiesPanelRef.current.attachTo(node),
      attachResultContainer: (node) => resultViewRef.current.attachTo(node),
      get: (name, strict) => formEditorRef.current.get(name, strict),
      getDataEditor: () => dataEditorRef.current,
      getEditor: () => formEditorRef.current,
      getForm: () => formRef.current,
      getResultView: () => resultViewRef.current,
      getSchema: () => formEditorRef.current.getSchema(),
      setSchema: setInitialSchema,
      saveSchema: () => formEditorRef.current.saveSchema()
    });
  });

  useEffect(() => {
    setInitialSchema(props.schema || {});
  }, [ props.schema ]);

  useEffect(() => {
    const dataEditor = dataEditorRef.current = new JSONEditor({
      value: toString(data),
      contentAttributes: { 'aria-label': 'Form Input' }
    });

    const resultView = resultViewRef.current = new JSONEditor({
      readonly: true,
      value: toString(resultData),
      contentAttributes: { 'aria-label': 'Form Output' }
    });

    const form = formRef.current = new Form({
      additionalModules: viewerAdditionalModules,
      properties: {
        ...viewerProperties,
        'ariaLabel': 'Form Preview'
      }
    });

    const formEditor = formEditorRef.current = new FormEditor({
      renderer: {
        compact: true
      },
      palette: {
        parent: paletteContainerRef.current
      },
      propertiesPanel: {
        parent: propertiesPanelContainerRef.current
      },
      exporter: exporterConfig,
      properties: {
        ...editorProperties,
        'ariaLabel': 'Form Definition'
      },
      additionalModules: editorAdditionalModules
    });

    paletteRef.current = formEditor.get('palette');
    propertiesPanelRef.current = formEditor.get('propertiesPanel');

    formEditor.on('changed', () => {
      setSchema(formEditor.getSchema());
    });

    formEditor.on('formEditor.rendered', () => {

      // notifiy interested parties after render
      emit('formPlayground.rendered');
    });

    form.on('changed', () => {
      setResultData(form._getSubmitData());
    });

    dataEditor.on('changed', event => {
      try {
        setData(JSON.parse(event.value));
      } catch (error) {

        // notify interested about input data error
        emit('formPlayground.inputDataError', error);
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
    dataEditorRef.current.setValue(toString(initialData));
  }, [ initialData ]);

  useEffect(() => {
    if (initialSchema) {
      formEditorRef.current.importSchema(initialSchema);
      dataEditorRef.current.setVariables(getSchemaVariables(initialSchema));
    }
  }, [ initialSchema ]);

  useEffect(() => {
    if (schema && dataContainerRef.current) {
      const variables = getSchemaVariables(schema);
      dataEditorRef.current.setVariables(variables);
    }
  }, [ schema ]);

  useEffect(() => {
    schema && formRef.current.importSchema(schema, data);
  }, [ schema, data ]);

  useEffect(() => {
    resultViewRef.current.setValue(toString(resultData));
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
    <div class={ classNames(
      'fjs-container',
      'fjs-pgl-root'
    ) }>
      <div class="fjs-pgl-modals">
        { showEmbed ? <EmbedModal schema={ schema } data={ data } onClose={ hideEmbedModal } /> : null }
      </div>
      <div class="fjs-pgl-palette-container" ref={ paletteContainerRef } />
      <div class="fjs-pgl-main">

        <Section name="Form Definition">

          {
            displayActions && <Section.HeaderItem>
              <button
                class="fjs-pgl-button"
                title="Download form definition"
                onClick={ handleDownload }
              >Download</button>
            </Section.HeaderItem>
          }

          {
            displayActions && <Section.HeaderItem>
              <button
                class="fjs-pgl-button"
                onClick={ showEmbedModal }
              >Embed</button>
            </Section.HeaderItem>
          }

          <div ref={ editorContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Preview">
          <div ref={ formContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Input">
          <div ref={ dataContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
        <Section name="Form Output">
          <div ref={ resultContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
      </div>
      <div class="fjs-pgl-properties-container" ref={ propertiesPanelContainerRef } />
    </div>
  );
}


// helpers ///////////////

function toString(obj) {
  return JSON.stringify(obj, null, '  ');
}
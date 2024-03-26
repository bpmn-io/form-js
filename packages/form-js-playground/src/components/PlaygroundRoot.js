import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
import { isFunction } from 'min-dash';
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

export function PlaygroundRoot(config) {

  const {
    additionalModules, // goes into both editor + viewer
    actions: actionsConfig,
    emit,
    exporter: exporterConfig,
    viewerProperties,
    editorProperties,
    viewerAdditionalModules,
    editorAdditionalModules,
    propertiesPanel: propertiesPanelConfig,
    apiLinkTarget,
    onInit
  } = config;

  const {
    display: displayActions = true
  } = actionsConfig || {};

  const editorContainerRef = useRef();
  const paletteContainerRef = useRef();
  const propertiesPanelContainerRef = useRef();
  const viewerContainerRef = useRef();
  const inputDataContainerRef = useRef();
  const outputDataContainerRef = useRef();

  const formEditorRef = useRef();
  const formViewerRef = useRef();
  const inputDataRef = useRef();
  const outputDataRef = useRef();

  const [ showEmbed, setShowEmbed ] = useState(false);
  const [ schema, setSchema ] = useState();
  const [ data, setData ] = useState();

  const load = useCallback((schema, data) => {
    formEditorRef.current.importSchema(schema, data);
    inputDataRef.current.setValue(toString(data));
    setSchema(schema);
    setData(data);
  }, []);

  // initialize and link the editors
  useEffect(() => {
    const inputDataEditor = inputDataRef.current = new JSONEditor({
      contentAttributes: { 'aria-label': 'Form Input', tabIndex: 0 },
      placeholder: createDataEditorPlaceholder()
    });

    const outputDataEditor = outputDataRef.current = new JSONEditor({
      readonly: true,
      contentAttributes: { 'aria-label': 'Form Output', tabIndex: 0 }
    });

    const formViewer = formViewerRef.current = new Form({
      container: viewerContainerRef.current,
      additionalModules: [
        ...(additionalModules || []),
        ...(viewerAdditionalModules || [])
      ],
      properties: {
        ...(viewerProperties || {}),
        'ariaLabel': 'Form Preview'
      }
    });

    const formEditor = formEditorRef.current = new FormEditor({
      container: editorContainerRef.current,
      renderer: {
        compact: true
      },
      palette: {
        parent: paletteContainerRef.current
      },
      propertiesPanel: {
        parent: propertiesPanelContainerRef.current,
        ...(propertiesPanelConfig || {})
      },
      exporter: exporterConfig,
      properties: {
        ...(editorProperties || {}),
        'ariaLabel': 'Form Definition'
      },
      additionalModules: [
        ...(additionalModules || []),
        ...(editorAdditionalModules || [])
      ]
    });

    formEditor.on('formField.add', ({ formField }) => {
      const formFields = formEditor.get('formFields');
      const { config } = formFields.get(formField.type);
      const { generateInitialDemoData } = config;
      const { id } = formField;

      if (!isFunction(generateInitialDemoData)) {
        return;
      }

      const initialDemoData = generateInitialDemoData(formField);

      if ([ initialDemoData, id ].includes(undefined)) {
        return;
      }

      setData((currentData) => {
        const newData = {
          ...currentData,
          [id]: initialDemoData,
        };

        inputDataRef.current.setValue(
          toString(newData)
        );

        return newData;
      });
    });

    formEditor.on('changed', () => {
      setSchema(formEditor.getSchema());
    });

    formEditor.on('formEditor.rendered', () => {

      // notify interested parties after render
      emit('formPlayground.rendered');
    });

    // pipe viewer changes to output data editor
    formViewer.on('changed', () => {
      const submitData = formViewer._getSubmitData();
      outputDataEditor.setValue(toString(submitData));
    });

    inputDataEditor.on('changed', event => {
      try {
        setData(JSON.parse(event.value));
      } catch (error) {

        // notify interested about input data error
        emit('formPlayground.inputDataError', error);
      }
    });

    inputDataEditor.attachTo(inputDataContainerRef.current);
    outputDataEditor.attachTo(outputDataContainerRef.current);

    return () => {
      inputDataEditor.destroy();
      outputDataEditor.destroy();
      formViewer.destroy();
      formEditor.destroy();
    };
  }, [ additionalModules, editorAdditionalModules, editorProperties, emit, exporterConfig, propertiesPanelConfig, viewerAdditionalModules, viewerProperties ]);

  // initialize data through props
  useEffect(() => {
    if (!config.initialSchema) {
      return;
    }

    load(config.initialSchema, config.initialData || {});
  }, [ config.initialSchema, config.initialData, load ]);

  useEffect(() => {
    schema && formViewerRef.current.importSchema(schema, data);
  }, [ schema, data ]);

  useEffect(() => {
    if (schema && inputDataContainerRef.current) {
      const variables = getSchemaVariables(schema);
      inputDataRef.current.setVariables(variables);
    }
  }, [ schema ]);

  // exposes api to parent
  useEffect(() => {

    if (!apiLinkTarget) {
      return;
    }

    apiLinkTarget.api = {
      attachDataContainer: (node) => inputDataRef.current.attachTo(node),
      attachResultContainer: (node) => outputDataRef.current.attachTo(node),
      attachFormContainer: (node) => formViewerRef.current.attachTo(node),
      attachEditorContainer: (node) => formEditorRef.current.attachTo(node),
      attachPaletteContainer: (node) => formEditorRef.current.get('palette').attachTo(node),
      attachPropertiesPanelContainer: (node) => formEditorRef.current.get('propertiesPanel').attachTo(node),
      get: (name, strict) => formEditorRef.current.get(name, strict),
      getDataEditor: () => inputDataRef.current,
      getEditor: () => formEditorRef.current,
      getForm: () => formViewerRef.current,
      getResultView: () => outputDataRef.current,
      getSchema: () => formEditorRef.current.getSchema(),
      saveSchema: () => formEditorRef.current.saveSchema(),
      setSchema: setSchema,
      setData: setData
    };

    onInit();

  }, [ apiLinkTarget, onInit ]);

  // separate effect for state to avoid re-creating the api object every time
  useEffect(() => {

    if (!apiLinkTarget) {
      return;
    }

    apiLinkTarget.api.getState = () => ({ schema, data });
    apiLinkTarget.api.load = load;

  }, [ apiLinkTarget, schema, data, load ]);

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
                type="button"
                class="fjs-pgl-button"
                title="Download form definition"
                onClick={ handleDownload }
              >Download</button>
            </Section.HeaderItem>
          }

          {
            displayActions && <Section.HeaderItem>
              <button
                type="button"
                class="fjs-pgl-button"
                onClick={ showEmbedModal }
              >Embed</button>
            </Section.HeaderItem>
          }

          <div ref={ editorContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Preview">
          <div ref={ viewerContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Input">
          <div ref={ inputDataContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
        <Section name="Form Output">
          <div ref={ outputDataContainerRef } class="fjs-pgl-text-container"></div>
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

function createDataEditorPlaceholder() {
  const element = document.createElement('p');

  element.innerHTML = 'Use this panel to simulate the form input, such as process variables.\nThis helps to test the form by populating the preview.\n\n' +
    'Follow the JSON format like this:\n\n' +
    '{\n  "variable": "value"\n}';

  return element;
}
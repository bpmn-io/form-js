import { render } from 'preact';

import fileDrop from 'file-drops';

import mitt from 'mitt';

import { PlaygroundRoot } from './components/PlaygroundRoot';

/**
 * @typedef { import('@bpmn-io/form-js-viewer/dist/types/types').FormProperties } FormProperties
 * @typedef { import('@bpmn-io/form-js-editor/dist/types/types').FormEditorProperties } FormEditorProperties
 *
 * @typedef { {
 *  actions?: { display: Boolean }
 *  additionalModules?: Array<any>
 *  container?: Element
 *  data: any
 *  editor?: { inlinePropertiesPanel: Boolean }
 *  editorAdditionalModules?: Array<any>
 *  editorProperties?: FormEditorProperties
 *  exporter?: { name: String, version: String }
 *  propertiesPanel?: { parent: Element, feelPopupContainer: Element }
 *  schema: any
 *  viewerAdditionalModules?: Array<any>
 *  viewerProperties?: FormProperties
 * } } FormPlaygroundOptions
 */

/**
 * @param {FormPlaygroundOptions} options
 */
function Playground(options) {

  const {
    container: parent,
    schema: initialSchema,
    data: initialData,
    ...rest
  } = options;

  const emitter = mitt();

  const container = document.createElement('div');

  container.classList.add('fjs-pgl-parent');

  if (parent) {
    parent.appendChild(container);
  }

  const handleDrop = fileDrop('Drop a form file', function(files) {
    const file = files[0];

    if (file) {
      try {
        this.api.setSchema(JSON.parse(file.contents));
      } catch (err) {

        // TODO(nikku): indicate JSON parse error
      }
    }
  });

  const safe = function(fn) {
    return function(...args) {
      if (!this.api) {
        throw new Error('Playground is not initialized.');
      }

      return fn(...args);
    };
  };

  const onInit = function() {
    emitter.emit('formPlayground.init');
  };

  container.addEventListener('dragover', handleDrop);

  render(
    <PlaygroundRoot
      initialSchema={ initialSchema }
      initialData={ initialData }
      emit={ emitter.emit }
      apiLinkTarget={ this }
      onInit={ onInit }
      { ...rest }
    />,
    container
  );

  this.on = emitter.on;
  this.off = emitter.off;

  this.emit = emitter.emit;

  this.on('destroy', () => {
    render(null, container);
    parent.removeChild(container);
  });

  this.destroy = () => this.emit('destroy');

  this.getState = safe(() => this.api.getState());

  this.getSchema = safe(() => this.api.getSchema());

  this.setSchema = safe((schema) => this.api.setSchema(schema));

  this.saveSchema = safe(() => this.api.saveSchema());

  this.get = safe((name, strict) => this.api.get(name, strict));

  this.getDataEditor = safe(() => this.api.getDataEditor());

  this.getEditor = safe(() => this.api.getEditor());

  this.getForm = safe((name, strict) => this.api.getForm(name, strict));

  this.getResultView = safe(() => this.api.getResultView());

  this.attachEditorContainer = safe((node) => this.api.attachEditorContainer(node));

  this.attachPreviewContainer = safe((node) => this.api.attachFormContainer(node));

  this.attachDataContainer = safe((node) => this.api.attachDataContainer(node));

  this.attachResultContainer = safe((node) => this.api.attachResultContainer(node));

  this.attachPaletteContainer = safe((node) => this.api.attachPaletteContainer(node));

  this.attachPropertiesPanelContainer = safe((node) => this.api.attachPropertiesPanelContainer(node));
}

export { Playground };
import { render } from 'preact';

import fileDrop from 'file-drops';

import mitt from 'mitt';

import { PlaygroundRoot } from './components/PlaygroundRoot';

/**
 * @typedef { {
 *  actions?: { display: Boolean }
 *  container?: Element
 *  data: any
 *  editor?: { inlinePropertiesPanel: Boolean }
 *  exporter?: { name: String, version: String }
 *  schema: any
 * } } FormPlaygroundOptions
 */

/**
 * @param {FormPlaygroundOptions} options
 */
export default function Playground(options) {

  const {
    container: parent,
    schema,
    data,
    ...rest
  } = options;

  const emitter = mitt();

  let state = { data, schema };
  let ref;

  const container = document.createElement('div');

  container.classList.add('fjs-pgl-parent');

  if (parent) {
    parent.appendChild(container);
  }

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

  const withRef = function(fn) {
    return function(...args) {
      if (!ref) {
        throw new Error('Playground is not initialized.');
      }

      return fn(...args);
    };
  };

  const onInit = function(_ref) {
    ref = _ref;
    emitter.emit('formPlayground.init');
  };

  container.addEventListener('dragover', handleDrop);

  render(
    <PlaygroundRoot
      data={ data }
      emit={ emitter.emit }
      onInit={ onInit }
      onStateChanged={ (_state) => state = _state }
      schema={ schema }
      { ...rest }
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

  this.getSchema = withRef(function() {
    return ref.getSchema();
  });

  this.setSchema = withRef(function(schema) {
    return ref.setSchema(schema);
  });

  this.saveSchema = withRef(function() {
    return ref.saveSchema();
  });

  this.get = withRef(function(name, strict) {
    return ref.get(name, strict);
  });

  this.getEditor = withRef(function() {
    return ref.getEditor();
  });

  this.destroy = function() {
    this.emit('destroy');
  };

  this.attachEditorContainer = withRef(function(node) {
    return ref.attachEditorContainer(node);
  });

  this.attachPreviewContainer = withRef(function(node) {
    return ref.attachFormContainer(node);
  });

  this.attachDataContainer = withRef(function(node) {
    return ref.attachDataContainer(node);
  });

  this.attachResultContainer = withRef(function(node) {
    return ref.attachResultContainer(node);
  });

  this.attachPaletteContainer = withRef(function(node) {
    return ref.attachPaletteContainer(node);
  });

  this.attachPropertiesPanelContainer = withRef(function(node) {
    return ref.attachPropertiesPanelContainer(node);
  });
}
import { render } from 'preact';

import fileDrop from 'file-drops';

import mitt from 'mitt';

import { PlaygroundRoot } from './components/PlaygroundRoot';

/**
 * @typedef { {
 *  container: Element,
 *  schema: any,
 *  data: any,
 *  editor?: { inlinePropertiesPanel: Boolean }
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
      emit={ emitter.emit }
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

  this.setSchema = function(schema) {
    return ref.setSchema(schema);
  };

  this.get = function(name, strict) {
    return ref.get(name, strict);
  };

  this.destroy = function() {
    this.emit('destroy');
  };
}
import mitt from 'mitt';

import { set } from 'min-dash';

import {
  clone,
  FieldRegistry,
  importSchema,
  exportSchema
} from '@bpmn-io/form-js-viewer';

import arrayMove from 'array-move';

export default class FormEditorCore {
  constructor(options) {

    const {
      properties = {},
      schema = {}
    } = options;

    this.emitter = mitt();

    this.fields = new FieldRegistry(this);

    // TODO(philippfromme): refactor assignment of IDs once we support arrays
    const {
      schema: importedSchema
    } = importSchema(schema);

    this.initialSchema = clone(importedSchema);

    this.state = {
      properties,
      schema: clone(this.initialSchema)
    };
  }

  addField(targetField, targetIndex, field) {
    const fields = arrayAdd(targetField.components, targetIndex, field);

    const schema = set(this.state.schema, [ ...targetField.schemaPath, 'components' ], fields);

    this.setState({ schema });
  }

  moveField(sourceField, targetField, sourceIndex, targetIndex) {
    let schema;

    if (sourceField.id === targetField.id) {
      if (sourceIndex < targetIndex) {
        targetIndex--;
      }

      const fields = arrayMove(sourceField.components, sourceIndex, targetIndex);

      schema = set(this.state.schema, [ ...sourceField.schemaPath, 'components' ], fields);
    } else {
      throw new Error('Moving form field between containers not supported');
    }

    this.setState({ schema });
  }

  removeField(sourceField, sourceIndex) {
    const fields = arrayRemove(sourceField.components, sourceIndex);

    const schema = set(this.state.schema, [ ...sourceField.schemaPath, 'components' ], fields);

    this.setState({ schema });
  }

  editFormField() {}

  reset() {
    this.setState({
      schema: clone(this.initialSchema)
    });
  }

  getState() {
    return clone(this.state);
  }

  getSchema() {
    return exportSchema(this.state.schema);
  }

  setState(state) {
    this.state = {
      ...this.state,
      ...state
    };

    this.changed(this.state);
  }

  changed(state) {
    this.emitter.emit('changed', clone(state));
  }

  setProperty(property, value) {
    const properties = set(this.getState().properties, [ property ], value);

    this.setState({ properties });
  }

  on(event, callback) {
    this.emitter.on(event, callback);
  }

  off(event, callback) {
    this.emitter.off(event, callback);
  }
}

function arrayAdd(array, index, item) {
  const copy = [ ...array ];

  copy.splice(index, 0, item);

  return copy;
}

function arrayRemove(array, index) {
  const copy = [ ...array ];

  copy.splice(index, 1);

  return copy;
}
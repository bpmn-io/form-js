import mitt from 'mitt';

import {
  get,
  set
} from 'min-dash';

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
    let schema = clone(this.state.schema);

    const targetSchemaPath = [ ...targetField.schemaPath, 'components' ];

    schema = set(
      schema,
      targetSchemaPath,
      arrayAdd(get(schema, targetSchemaPath), targetIndex, field)
    );

    field.parent = targetField.id;

    this.setState({ schema });
  }

  moveField(sourceField, targetField, sourceIndex, targetIndex) {
    let schema = clone(this.state.schema);

    const sourceSchemaPath = [ ...sourceField.schemaPath, 'components' ];

    if (sourceField.id === targetField.id) {
      if (sourceIndex < targetIndex) {
        targetIndex--;
      }

      schema = set(
        schema,
        sourceSchemaPath,
        arrayMove(get(schema, sourceSchemaPath), sourceIndex, targetIndex)
      );
    } else {
      const field = get(schema, sourceSchemaPath)[ sourceIndex ];

      schema = set(
        schema,
        sourceSchemaPath,
        arrayRemove(get(schema, sourceSchemaPath), sourceIndex)
      );

      const targetSchemaPath = [ ...targetField.schemaPath, 'components' ];
      
      schema = set(
        schema,
        targetSchemaPath,
        arrayAdd(get(schema, targetSchemaPath), targetIndex, field)
      );

      field.parent = targetField.id;
    }

    this.setState({ schema });
  }

  removeField(sourceField, sourceIndex) {
    let schema = clone(this.state.schema);

    const sourceSchemaPath = [ ...sourceField.schemaPath, 'components' ];

    schema = set(
      schema,
      sourceSchemaPath,
      arrayRemove(get(schema, sourceSchemaPath), sourceIndex)
    );

    this.setState({ schema });
  }

  editField(field, key, value) {
    let schema = clone(this.state.schema);

    const path = [ ...field.schemaPath, key ];

    schema = set(
      schema,
      path,
      value
    );

    this.setState({ schema });
  }

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
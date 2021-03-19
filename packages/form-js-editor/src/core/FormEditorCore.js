import mitt from 'mitt';

import {
  get,
  set
} from 'min-dash';

import {
  clone,
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

    const {
      schema: importedSchema,
      fields
    } = importSchema(schema);

    console.log(importedSchema, fields);

    this.fields = fields;

    this.initialSchema = clone(importedSchema);

    this.state = {
      properties,
      schema: clone(this.initialSchema)
    };
  }

  addField(targetField, targetIndex, newField) {
    let schema = clone(this.state.schema);

    const targetPath = [ ...targetField.path, 'components' ];

    newField.parent = targetField.id;

    const fields = arrayAdd(get(schema, targetPath), targetIndex, newField)
      .map((field, index) => updatePath(this.fields, field, index));

    schema = set(
      schema,
      targetPath,
      fields
    );

    // Update siblings
    fields.forEach(field => this.fields.set(field.id, field));

    // Update parent
    this.fields.set(targetField.id, get(schema, targetPath.path));

    this.setState({ schema });
  }

  moveField(sourceField, targetField, sourceIndex, targetIndex) {
    let schema = clone(this.state.schema);

    const sourcePath = [ ...sourceField.path, 'components' ];

    if (sourceField.id === targetField.id) {
      if (sourceIndex < targetIndex) {
        targetIndex--;
      }

      const fields = arrayMove(get(schema, sourcePath), sourceIndex, targetIndex)
        .map((field, index) => updatePath(this.fields, field, index));

      schema = set(
        schema,
        sourcePath,
        fields
      );

      // Update siblings
      fields.forEach(field => this.fields.set(field.id, field));

      // Update parent
      this.fields.set(sourceField.id, get(schema, sourcePath.path));
    } else {
      const field = get(schema, sourcePath)[ sourceIndex ];

      field.parent = targetField.id;

      let fields = arrayRemove(get(schema, sourcePath), sourceIndex)
        .map((field, index) => updatePath(this.fields, field, index));

      schema = set(
        schema,
        sourcePath,
        fields
      );

      // Update siblings
      fields.forEach(field => this.fields.set(field.id, field));

      // Update parent
      this.fields.set(sourceField.id, get(schema, sourceField.path));

      const targetPath = [ ...targetField.path, 'components' ];

      fields = arrayAdd(get(schema, targetPath), targetIndex, field)
        .map((field, index) => updatePath(this.fields, field, index));

      schema = set(
        schema,
        targetPath,
        fields
      );

      // Update siblings
      fields.forEach(field => this.fields.set(field.id, field));

      // Update parent
      this.fields.set(targetField.id, get(schema, targetField.path));
    }

    this.setState({ schema });
  }

  removeField(sourceField, sourceIndex) {
    let schema = clone(this.state.schema);

    const sourcePath = [ ...sourceField.path, 'components' ];

    const fields = arrayRemove(get(schema, sourcePath), sourceIndex)
      .map((field, index) => updatePath(this.fields, field, index));

    schema = set(
      schema,
      sourcePath,
      fields
    );

    // Update siblings
    fields.forEach(field => this.fields.set(field.id, field));

    // Update parent
    this.fields.set(sourceField.id, get(schema, sourcePath.path));

    this.setState({ schema });
  }

  editField(field, key, value) {
    let schema = clone(this.state.schema);

    field = {
      ...field,
      [ key ]: value
    };

    const {
      id,
      path
    } = field;

    schema = set(
      schema,
      path,
      field
    );

    this.fields.set(id, field);

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

function updatePath(fields, field, index) {
  const parent = fields.get(field.parent);

  field.path = [ ...parent.path, 'components', index ];

  return field;
}
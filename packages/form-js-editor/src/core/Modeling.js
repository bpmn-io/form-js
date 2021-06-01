import arrayMove from 'array-move';

import {
  get,
  set
} from 'min-dash';

import { clone } from '@bpmn-io/form-js-viewer';


export default class Modeling {
  constructor(formEditor, formFieldRegistry) {
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;
  }

  addField(targetFormField, targetIndex, newFormField) {
    let { schema } = clone(this._formEditor._getState());

    const targetPath = [ ...targetFormField.path, 'components' ];

    newFormField.parent = targetFormField.id;

    const formFields = arrayAdd(get(schema, targetPath), targetIndex, newFormField)
      .map((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    schema = set(
      schema,
      targetPath,
      formFields
    );

    // Update siblings
    formFields.forEach(formFields => this._formFieldRegistry.set(formFields.id, formFields));

    // Update parent
    this._formFieldRegistry.set(targetFormField.id, get(schema, targetFormField.path));

    this._formEditor._setState({ schema });
  }

  moveField(sourceFormField, targetFormField, sourceIndex, targetIndex) {
    let { schema } = clone(this._formEditor._getState());

    const sourcePath = [ ...sourceFormField.path, 'components' ];

    if (sourceFormField.id === targetFormField.id) {
      if (sourceIndex < targetIndex) {
        targetIndex--;
      }

      const formFields = arrayMove(get(schema, sourcePath), sourceIndex, targetIndex)
        .map((formField, index) => updatePath(this._formFieldRegistry, formField, index));

      schema = set(
        schema,
        sourcePath,
        formFields
      );

      // Update siblings
      formFields.forEach(formField => this._formFieldRegistry.set(formField.id, formField));

      // Update parent
      this._formFieldRegistry.set(sourceFormField.id, get(schema, sourceFormField.path));
    } else {
      const formField = get(schema, sourcePath)[ sourceIndex ];

      formField.parent = targetFormField.id;

      let formFields = arrayRemove(get(schema, sourcePath), sourceIndex)
        .map((formField, index) => updatePath(this._formFieldRegistry, formField, index));

      schema = set(
        schema,
        sourcePath,
        formFields
      );

      // Update siblings
      formFields.forEach(formField => this._formFieldRegistry.set(formField.id, formField));

      // Update parent
      this._formFieldRegistry.set(sourceFormField.id, get(schema, sourceFormField.path));

      const targetPath = [ ...targetFormField.path, 'components' ];

      formFields = arrayAdd(get(schema, targetPath), targetIndex, formField)
        .map((formField, index) => updatePath(this._formFieldRegistry, formField, index));

      schema = set(
        schema,
        targetPath,
        formFields
      );

      // Update siblings
      formFields.forEach(formField => this._formFieldRegistry.set(formField.id, formField));

      // Update parent
      this._formFieldRegistry.set(targetFormField.id, get(schema, targetFormField.path));
    }

    this._formEditor._setState({ schema });
  }

  removeField(sourceFormField, sourceIndex) {
    let { schema } = clone(this._formEditor._getState());

    const sourcePath = [ ...sourceFormField.path, 'components' ];

    this._formFieldRegistry.delete(get(schema, [ ...sourcePath, sourceIndex ]).id);

    const formFields = arrayRemove(get(schema, sourcePath), sourceIndex)
      .map((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    schema = set(
      schema,
      sourcePath,
      formFields
    );

    // Update siblings
    formFields.forEach(formField => this._formFieldRegistry.set(formField.id, formField));

    // Update parent
    this._formFieldRegistry.set(sourceFormField.id, get(schema, sourceFormField.path));

    this._formEditor._setState({ schema });
  }

  editField(formField, key, value) {
    let { schema } = clone(this._formEditor._getState());

    formField = {
      ...formField,
      [ key ]: value
    };

    const {
      id,
      path
    } = formField;

    schema = set(
      schema,
      path,
      formField
    );

    this._formFieldRegistry.set(id, formField);

    this._formEditor._setState({ schema });
  }
}

Modeling.$inject = [ 'formEditor', 'formFieldRegistry' ];

// helpers //////////

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

function updatePath(formFields, formField, index) {
  const parent = formFields.get(formField.parent);

  formField.path = [ ...parent.path, 'components', index ];

  return formField;
}
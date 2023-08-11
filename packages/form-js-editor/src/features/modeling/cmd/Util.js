export function arrayAdd(array, index, item) {
  array.splice(index, 0, item);

  return array;
}

export { mutate as arrayMove } from 'array-move';

export function arrayRemove(array, index) {
  array.splice(index, 1);

  return array;
}

export function updatePath(formFieldRegistry, formField, index) {
  const parent = formFieldRegistry.get(formField._parent);
  refreshPathsRecursively(formField, [ ...parent._path, 'components', index ]);
  return formField;
}

export function refreshPathsRecursively(formField, path) {

  formField._path = path;
  const components = formField.components || [];

  components.forEach((component, index) => {
    refreshPathsRecursively(component, [ ...path, 'components', index ]);
  });
}

export function updateRow(formField, rowId) {
  formField.layout = {
    ...formField.layout || {},
    row: rowId
  };

  return formField;
}
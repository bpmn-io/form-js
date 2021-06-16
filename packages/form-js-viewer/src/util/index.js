export * from './injector';
export * from './form';

export function findErrors(errors, path) {
  return errors[ pathStringify(path) ];
}

export function isRequired(field) {
  return field.required;
}

export function pathParse(path) {
  if (!path) {
    return [];
  }

  return path.split('.').map(key => {
    return isNaN(parseInt(key)) ? key : parseInt(key);
  });
}

export function pathsEqual(a, b) {
  return (
    a &&
    b &&
    a.length === b.length &&
    a.every((value, index) => value === b[ index ])
  );
}

export function pathStringify(path) {
  if (!path) {
    return '';
  }

  return path.join('.');
}

const indices = {};

export function generateIndexForType(type) {
  if (type in indices) {
    indices[ type ]++;
  } else {
    indices[ type ] = 1;
  }

  return indices[ type ];
}

export function generateIdForType(type) {
  return `${ type }${ generateIndexForType(type) }`;
}

/**
 * @template T
 * @param {T} data
 * @param {(this: any, key: string, value: any) => any} [replacer]
 * @return {T}
 */
export function clone(data, replacer) {
  return JSON.parse(JSON.stringify(data, replacer));
}

export function importSchema(schema) {
  schema = clone(schema);

  const fields = new Map();

  importField(schema, fields);

  return {
    schema,
    fields
  };
}

function importField(field, fields, parent, index) {
  const id = generateIdForType(field.type);

  field.id = id;

  fields.set(id, field);

  if (parent) {
    field.parent = parent.id;

    field.path = parent.path ? [ ...parent.path, 'components', index ] : [ 'components', index ];
  } else {
    field.path = [];
  }

  if (field.components) {
    importFields(field.components, fields, field);
  }
}

function importFields(components, fields, parent) {
  components.forEach((component, index) => {
    importField(component, fields, parent, index);
  });
}
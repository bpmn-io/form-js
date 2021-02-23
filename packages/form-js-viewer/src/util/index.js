import { createMemo } from 'solid-js';

import { isFunction } from 'min-dash';

export function computePath(callback) {
  return createMemo(callback, [], pathsEqual);
}

export function findData(data, path) {
  for (const key of path) {
    data = data[key];

    if (data === undefined) {
      return undefined;
    }
  }

  return data;
}

export function findErrors(errors, path) {
  return errors[ pathStringify(path) ];
}

export function findFieldRenderer(renderers, type) {
  return renderers.find(renderer => {
    return isFunction(renderer.create) && renderer.create().type === type;
  });
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
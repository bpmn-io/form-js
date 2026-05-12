export function isRequired(field) {
  return field.required;
}

export function pathParse(path) {
  if (!path) {
    return [];
  }

  return path.split('.').map((key) => {
    return isNaN(parseInt(key)) ? key : parseInt(key);
  });
}

export function pathsEqual(a, b) {
  return a && b && a.length === b.length && a.every((value, index) => value === b[index]);
}

const indices = {};

export function generateIndexForType(type) {
  if (type in indices) {
    indices[type]++;
  } else {
    indices[type] = 1;
  }

  return indices[type];
}

export function generateIdForType(type) {
  return `${type}${generateIndexForType(type)}`;
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

export function runRecursively(formField, fn) {
  const components = formField.components || [];

  components.forEach((component, _) => {
    runRecursively(component, fn);
  });

  fn(formField);
}

/**
 * Returns a copy of `target` with the value at `path` removed, pruning any
 * ancestor that becomes empty. Pure: the input is not mutated and untouched
 * sibling branches keep their original references (path-cloning).
 *
 * Pruning rules:
 *  - An object ancestor is removed when it has no own keys left.
 *  - An array ancestor is removed when every entry is nullish. Arrays are
 *    never compacted; `delete` leaves a sparse hole so sibling indexes stay
 *    stable.
 *
 * @template T
 * @param {T} target
 * @param {Array<string|number>} path
 * @returns {T}
 */
export function pruneAt(target, path) {
  if (!path.length) {
    return target;
  }

  const cloneContainer = (c) => (Array.isArray(c) ? c.slice() : { ...c });

  const clones = [cloneContainer(target)];
  for (let i = 0; i < path.length - 1; i++) {
    const next = clones[i][path[i]];
    if (next == null || typeof next !== 'object') {
      return target;
    }
    const cloned = cloneContainer(next);
    clones[i][path[i]] = cloned;
    clones.push(cloned);
  }

  delete clones[clones.length - 1][path[path.length - 1]];

  for (let i = clones.length - 1; i > 0; i--) {
    if (Object.values(clones[i]).every((v) => v == null)) {
      delete clones[i - 1][path[i - 1]];
    } else {
      break;
    }
  }

  return clones[0];
}

export function wrapObjectKeysWithUnderscores(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[`_${key}_`] = value;
  }
  return newObj;
}

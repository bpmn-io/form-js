import {
  batch
} from 'solid-js';

import {
  pathStringify
} from '../util';


export default class Fields {

  /**
   * @param {import('./FormCore').default} core
   */
  constructor(core) {
    this.core = core;
    this.fields = [];
  }

  add(path, field) {

    const id = pathStringify(path);

    this.fields.push({
      field,
      id,
      path
    });
  }

  update(path, newPath) {
    const oldId = pathStringify(path);
    const newId = pathStringify(newPath);

    this.fields = this.fields.map(registration => {
      if (registration.id === oldId) {
        return {
          ...registration,
          path: newPath,
          id: newId
        };
      }

      return registration;
    });

    const fieldErrors = this.core.state.errors[oldId];

    batch(() => {
      this.core.setState('errors', oldId, undefined);
      this.core.setState('errors', newId, fieldErrors);
    });
  }

  remove(path) {

    const id = pathStringify(path);

    this.fields = this.fields.filter(registration => {
      return registration.id !== id;
    });

    this.core.setState('errors', id, undefined);
  }

  getById(id) {
    return this.fields.find((registration) => {
      return registration.id === id;
    });
  }

  getAll() {
    return this.fields;
  }
}
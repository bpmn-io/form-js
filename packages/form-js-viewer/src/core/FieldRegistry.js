export default class Fields {

  /**
   * @param {import('./FormCore').default} core
   */
  constructor(core) {
    this.core = core;
    this.fields = {};
  }

  add(id, field) {
    this.fields[ id ] = field;
  }

  remove(id) {
    delete this.fields[ id ];
  }

  get(id) {
    return this.fields[ id ];
  }

  getAll() {
    return this.fields;
  }
}
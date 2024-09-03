const fileRegistry = Symbol('fileRegistry');

class FileRegistry {
  constructor() {
    /** @type {Map<string, File[]>} */
    this[fileRegistry] = new Map();
  }

  /**
   * @param {string} id
   * @param {File[]} files
   */
  setFiles(id, files) {
    this[fileRegistry].set(id, files);
  }

  /**
   * @param {string} id
   * @returns {File[]}
   */
  getFiles(id) {
    return this[fileRegistry].get(id) || [];
  }

  /**
   * @returns {string[]}
   */
  getKeys() {
    return Array.from(this[fileRegistry].keys());
  }

  /**
   * @param {string} id
   */
  deleteFiles(id) {
    this[fileRegistry].delete(id);
  }

  /**
   * @returns {Map<string, File[]>}
   */
  getAllFiles() {
    return new Map(this[fileRegistry]);
  }

  reset() {
    this[fileRegistry].clear();
  }
}

export { FileRegistry };

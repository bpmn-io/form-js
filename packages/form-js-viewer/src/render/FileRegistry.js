import { getDataFileReferences } from '../util/files';
import { FILE_PICKER_FILE_KEY_PREFIX } from '../util/constants/FilePickerConstants';

const fileRegistry = Symbol('fileRegistry');
const EMPTY_ARRAY = [];

class FileRegistry {
  constructor(eventBus, formFieldRegistry, formFieldInstanceRegistry) {
    /** @type {Map<string, File[]>} */
    this[fileRegistry] = new Map();
    this._eventBus = eventBus;
    this._formFieldRegistry = formFieldRegistry;
    this._formFieldInstanceRegistry = formFieldInstanceRegistry;

    eventBus.on('form.clear', () => this.clear());
    eventBus.on('repeatRenderManager.remove', ({ item }) => {
      const fileReferences = getDataFileReferences(item);

      // Remove all file references from the registry
      fileReferences.forEach((fileReference) => {
        this.deleteFiles(fileReference);
      });
    });
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
    return this[fileRegistry].get(id) || EMPTY_ARRAY;
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

  /**
   * @returns {Map<string, File[]>}
   */
  getSubmitFiles() {
    const instancedFileReferences = this._formFieldInstanceRegistry
      .getAll()
      .filter(
        (instance) =>
          this._formFieldRegistry.get(instance.id).type === 'filepicker' &&
          typeof instance.value === 'string' &&
          instance.value.startsWith(FILE_PICKER_FILE_KEY_PREFIX),
      )
      .map((formFieldInstance) => formFieldInstance.value);

    return new Map(
      Array.from(this[fileRegistry]).filter(([key]) => {
        return instancedFileReferences.includes(key);
      }),
    );
  }

  clear() {
    this[fileRegistry].clear();
  }
}

FileRegistry.$inject = ['eventBus', 'formFieldRegistry', 'formFieldInstanceRegistry'];

export { FileRegistry };

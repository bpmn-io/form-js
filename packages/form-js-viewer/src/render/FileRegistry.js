import { extractFileReferencesFromRemovedData } from '../util/extractFileReferencesFromRemovedData';

const fileRegistry = Symbol('fileRegistry');
const eventBusSymbol = Symbol('eventBus');
const formFieldRegistrySymbol = Symbol('formFieldRegistry');
const formFieldInstanceRegistrySymbol = Symbol('formFieldInstanceRegistry');
const EMPTY_ARRAY = [];

class FileRegistry {
  /**
   * @param {import('../core/EventBus').EventBus} eventBus
   * @param {import('../core/FormFieldRegistry').FormFieldRegistry} formFieldRegistry
   * @param {import('../core/FormFieldInstanceRegistry').FormFieldInstanceRegistry} formFieldInstanceRegistry
   */
  constructor(eventBus, formFieldRegistry, formFieldInstanceRegistry) {
    /** @type {Map<string, File[]>} */
    this[fileRegistry] = new Map();
    /** @type {import('../core/EventBus').EventBus} */
    this[eventBusSymbol] = eventBus;
    /** @type {import('../core/FormFieldRegistry').FormFieldRegistry} */
    this[formFieldRegistrySymbol] = formFieldRegistry;
    /** @type {import('../core/FormFieldInstanceRegistry').FormFieldInstanceRegistry} */
    this[formFieldInstanceRegistrySymbol] = formFieldInstanceRegistry;

    const removeFileHandler = ({ item }) => {
      const fileReferences = extractFileReferencesFromRemovedData(item);

      // Remove all file references from the registry
      fileReferences.forEach((fileReference) => {
        this.deleteFiles(fileReference);
      });
    };

    eventBus.on('form.clear', () => this.clear());
    eventBus.on('conditionChecker.remove', removeFileHandler);
    eventBus.on('repeatRenderManager.remove', removeFileHandler);
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
   * @returns {boolean}
   */
  hasKey(id) {
    return this[fileRegistry].has(id);
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

  clear() {
    this[fileRegistry].clear();
  }
}

FileRegistry.$inject = ['eventBus', 'formFieldRegistry', 'formFieldInstanceRegistry'];

export { FileRegistry };

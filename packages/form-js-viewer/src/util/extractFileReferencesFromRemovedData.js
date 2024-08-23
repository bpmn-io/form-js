import { FILE_PICKER_FILE_KEY_PREFIX } from './constants/FilePickerConstants';

/**
 * @typedef {Record<PropertyKey, unknown>} RemovedData
 * @param {RemovedData} removedData
 * @returns {string[]}
 */
const extractFileReferencesFromRemovedData = (removedData) => {
  /** @type {string[]} */
  const fileReferences = [];

  if (removedData === null) {
    return fileReferences;
  }

  Object.values(removedData).forEach((value) => {
    if (value === null) {
      return;
    }

    if (typeof value === 'object') {
      fileReferences.push(...extractFileReferencesFromRemovedData(/** @type {RemovedData} */ (value)));
    } else if (Array.isArray(value)) {
      fileReferences.push(...value.map(extractFileReferencesFromRemovedData).flat());
    } else if (typeof value === 'string' && value.startsWith(FILE_PICKER_FILE_KEY_PREFIX)) {
      fileReferences.push(value);
    }
  });

  return fileReferences;
};

export { extractFileReferencesFromRemovedData };

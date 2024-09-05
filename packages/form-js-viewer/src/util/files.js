import { FILE_PICKER_FILE_KEY_PREFIX } from './constants/FilePickerConstants';

const getDataFileReferences = (obj) => {
  const fileReferences = [];
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'object' && value !== null) {
      fileReferences.push(...getDataFileReferences(value));
    } else if (Array.isArray(value)) {
      fileReferences.push(...value.map(getDataFileReferences));
    } else if (typeof value === 'string' && value.startsWith(FILE_PICKER_FILE_KEY_PREFIX)) {
      fileReferences.push(value);
    }
  }
  return fileReferences;
};

export { getDataFileReferences };

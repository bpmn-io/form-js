/**
 * @returns {import("preact").JSX.Element}
 */
export function FilePicker() {
  return null;
}

FilePicker.config = {
  type: 'filepicker',
  keyed: true,
  label: 'File picker',
  group: 'basic-input',
  emptyValue: null,
  sanitizeValue: ({ value }) => {
    return value;
  },
  create: (options = {}) => ({ ...options }),
};

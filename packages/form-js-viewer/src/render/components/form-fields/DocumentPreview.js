/**
 * @returns {import("preact").JSX.Element}
 */
export function DocumentPreview() {
  return null;
}

DocumentPreview.config = {
  type: 'documentPreview',
  keyed: false,
  group: 'presentation',
  name: 'Document preview',
  create: (options = {}) => ({
    title: 'Document preview',
    ...options,
  }),
};

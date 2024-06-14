/**
 * Get the ancestry list of a form field.
 *
 * @param {string} formFieldId
 * @param {import('../core/FormFieldRegistry').FormFieldRegistry} formFieldRegistry
 *
 * @return {Array<string>} ancestry list
 */
export const getAncestryList = (formFieldId, formFieldRegistry) => {
  const ids = [];

  let currentFormField = formFieldRegistry.get(formFieldId);

  while (currentFormField) {
    ids.push(currentFormField.id);

    currentFormField = formFieldRegistry.get(currentFormField._parent);
  }

  return ids;
};

import { collectPaletteEntries } from '../palette/components/Palette';

/**
 * A context pad provider that contributes the delete action for form fields.
 *
 * @param {import('./FormFieldContextActions').FormFieldContextActions} formFieldContextActions
 * @param {import('../modeling/Modeling').Modeling} modeling
 * @param {import('../../core/FormFieldRegistry').FormFieldRegistry} formFieldRegistry
 * @param {import('../../render/EditorFormFields').EditorFormFields} formFields
 */
export class DeleteActionProvider {
  constructor(formFieldContextActions, modeling, formFieldRegistry, formFields) {
    this._modeling = modeling;
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;

    formFieldContextActions.registerProvider(500, this);
  }

  /**
   * @param {Object} formField
   * @return {Object} entries
   */
  getContextPadEntries(formField) {
    if (formField.type === 'default') {
      return {};
    }

    const modeling = this._modeling;
    const formFieldRegistry = this._formFieldRegistry;
    const formFields = this._formFields;

    return {
      delete: {
        action: (event) => {
          event.stopPropagation();

          const parentField = formFieldRegistry.get(formField._parent);
          const index = getFormFieldIndex(parentField, formField);

          modeling.removeFormField(formField, parentField, index);
        },
        title: getRemoveButtonTitle(formField, formFields),
        icon: 'delete',
        group: 'actions',
      },
    };
  }
}

DeleteActionProvider.$inject = ['formFieldContextActions', 'modeling', 'formFieldRegistry', 'formFields'];

// helpers //////////

function getFormFieldIndex(parent, formField) {
  let fieldFormIndex = parent.components.length;

  parent.components.forEach(({ id }, index) => {
    if (id === formField.id) {
      fieldFormIndex = index;
    }
  });

  return fieldFormIndex;
}

function findPaletteEntry(type, formFields) {
  return collectPaletteEntries(formFields).find((entry) => entry.type === type);
}

function getRemoveButtonTitle(formField, formFields) {
  const entry = findPaletteEntry(formField.type, formFields);

  if (!entry) {
    return 'Remove form field';
  }

  return `Remove ${entry.label}`;
}

import { isString, get } from 'min-dash';

import { hasIntegerPathSegment, isProhibitedPath, isValidDotPath } from '../Util';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useCallback } from 'preact/hooks';

export function KeyEntry(props) {
  const { editField, field, getService } = props;

  const entries = [];

  entries.push({
    id: 'key',
    component: Key,
    editField: editField,
    field: field,
    isEdited: isTextFieldEntryEdited,
    isDefaultVisible: (field) => {
      const formFields = getService('formFields');
      const { config } = formFields.get(field.type);
      return config.keyed;
    },
  });

  return entries;
}

function Key(props) {
  const { editField, field, id } = props;

  const pathRegistry = useService('pathRegistry');

  const debounce = useService('debounce');
  const translate = useService('translate');

  const path = ['key'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const validate = useCallback(
    (value) => {
      if (value === field.key) {
        return null;
      }

      if (!isString(value) || value.length === 0) {
        return translate('Must not be empty.');
      }

      if (!isValidDotPath(value)) {
        return translate('Must be a variable or a dot separated path.');
      }

      if (hasIntegerPathSegment(value)) {
        return translate('Must not contain numerical path segments.');
      }

      if (isProhibitedPath(value)) {
        return translate('Must not be a prohibited path.');
      }

      const replacements = {
        [field.id]: value.split('.'),
      };

      const oldPath = pathRegistry.getValuePath(field);
      const newPath = pathRegistry.getValuePath(field, { replacements });

      // unclaim temporarily to avoid self-conflicts
      pathRegistry.unclaimPath(oldPath);
      const canClaim = pathRegistry.canClaimPath(newPath, { isClosed: true, claimerId: field.id });
      pathRegistry.claimPath(oldPath, { isClosed: true, claimerId: field.id });

      return canClaim ? null : translate('Must not conflict with other key/path assignments.');
    },
    [field, pathRegistry, translate],
  );

  return TextFieldEntry({
    debounce,
    description: translate('Binds to a form variable'),
    element: field,
    getValue,
    id,
    label: translate('Key'),
    tooltip: translate(
      'Use a unique "key" to link the form element and the related input/output data. When dealing with nested data, break it down in the user task\'s input mapping before using it.',
    ),
    setValue,
    validate,
  });
}

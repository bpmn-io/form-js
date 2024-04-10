import { get, set } from 'min-dash';

import { useService } from '../hooks';

import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { useCallback } from 'preact/hooks';

export function CustomValidationEntry(props) {
  const { editField, field, idPrefix, index } = props;

  const entries = [
    {
      component: Condition,
      editField,
      field,
      id: idPrefix + '-condition',
      idPrefix,
      index,
    },
    {
      component: Message,
      editField,
      field,
      id: idPrefix + '-message',
      idPrefix,
      index,
    },
  ];

  return entries;
}

function Condition(props) {
  const { editField, field, id, index } = props;

  const debounce = useService('debounce');

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    const validate = get(field, ['validate']);
    const newValidate = set(validate, ['custom', index, 'condition'], value);

    return editField(field, 'validate', newValidate);
  };

  const getValue = () => {
    return get(field, ['validate', 'custom', index, 'condition']);
  };

  const conditionEntryValidate = useCallback((value) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'Must not be empty.';
    }
  }, []);

  return FeelEntry({
    feel: 'required',
    isEdited: isFeelEntryEdited,
    debounce,
    element: field,
    getValue,
    id,
    label: 'Condition',
    setValue,
    validate: conditionEntryValidate,
  });
}

function Message(props) {
  const { editField, field, id, index } = props;

  const debounce = useService('debounce');

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    const validate = get(field, ['validate']);
    const newValidate = set(validate, ['custom', index, 'message'], value);

    return editField(field, 'validate', newValidate);
  };

  const getValue = () => {
    return get(field, ['validate', 'custom', index, 'message']);
  };

  const messageEntryValidate = useCallback((value) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'Must not be empty.';
    }
  }, []);

  return FeelEntry({
    feel: 'optional',
    isEdited: isFeelEntryEdited,
    debounce,
    element: field,
    getValue,
    id,
    label: 'Message if condition not met',
    setValue,
    validate: messageEntryValidate,
  });
}

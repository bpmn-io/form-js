import { isUndefined } from 'min-dash';

import useService from '../../../hooks/useService';

import { TextInputEntry } from '../components';

export default function KeyEntry(props) {
  const {
    editField,
    field
  } = props;

  const formFieldRegistry = useService('formFieldRegistry');

  const validate = (value) => {
    if (isUndefined(value) || !value.length) {
      return 'Must not be empty.';
    }

    if (/\s/.test(value)) {
      return 'Must not contain spaces.';
    }

    if (!isUnique(value, field, formFieldRegistry)) {
      return 'Must be unique.';
    }

    return null;
  };

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="key"
      label="Key"
      description="Maps to a process variable."
      path={ [ 'key' ] }
      validate={ validate } />
  );
}

// helpers //////////

function isUnique(key, field, formFieldRegistry) {
  return !Array.from(formFieldRegistry.values()).find((formField) => {
    return formField !== field && formField.key === key;
  });
}
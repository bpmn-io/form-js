import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useCallback } from 'preact/hooks';


export function IdEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [];

  entries.push({
    id: 'id',
    component: Id,
    editField: editField,
    field: field,
    isEdited: isTextFieldEntryEdited,
    isDefaultVisible: (field) => field.type === 'default'
  });

  return entries;
}

function Id(props) {
  const {
    editField,
    field,
    id
  } = props;

  const formFieldRegistry = useService('formFieldRegistry');
  const debounce = useService('debounce');

  const path = [ 'id' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const validate = useCallback((value) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'Must not be empty.';
    }

    const assigned = formFieldRegistry._ids.assigned(value);

    if (assigned && assigned !== field) {
      return 'Must be unique.';
    }

    return validateId(value) || null;
  }, [ formFieldRegistry, field ]);

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'ID',
    setValue,
    validate,
  });
}

// id structural validation /////////////

const SPACE_REGEX = /\s/;

// for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar
const QNAME_REGEX = /^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i;

// for ID validation as per BPMN Schema (QName - Namespace)
const ID_REGEX = /^[a-z_][\w-.]*$/i;

function validateId(idValue) {

  if (containsSpace(idValue)) {
    return 'Must not contain spaces.';
  }

  if (!ID_REGEX.test(idValue)) {

    if (QNAME_REGEX.test(idValue)) {
      return 'Must not contain prefix.';
    }

    return 'Must be a valid QName.';
  }
}

function containsSpace(value) {
  return SPACE_REGEX.test(value);
}
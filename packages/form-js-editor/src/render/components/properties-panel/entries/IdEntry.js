import { isUndefined } from 'min-dash';

import useService from '../../../hooks/useService';

import { TextInputEntry } from '../components';

export default function IdEntry(props) {
  const {
    editField,
    field
  } = props;

  const formFieldRegistry = useService('formFieldRegistry');

  const validate = (value) => {
    if (isUndefined(value) || !value.length) {
      return 'Must not be empty.';
    }

    const assigned = formFieldRegistry._ids.assigned(value);

    if (assigned && assigned !== field) {
      return 'Must be unique.';
    }

    return validateId(value) || null;
  };

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="id"
      label="Id"
      path={ [ 'id' ] }
      validate={ validate } />
  );
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
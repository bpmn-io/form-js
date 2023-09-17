import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import { isValidDotPath } from '../Util';


export default function PathEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (type === 'group' || type === 'subform') {
    entries.push({
      id: 'path',
      component: Path,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited
    });
  }

  return entries;
}

function Path(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');
  const pathRegistry = useService('pathRegistry');

  const path = [ 'path' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const validate = (value) => {

    if (!value || value === field.path) {
      return null;
    }

    if (value && !isValidDotPath(value)) {
      return 'Must be empty, a variable or a dot separated path';
    }

    const hasIntegerPathSegment = value && value.split('.').some(segment => /^\d+$/.test(segment));
    if (hasIntegerPathSegment) {
      return 'Must not contain numerical path segments.';
    }

    const options = value && {
      replacements: {
        [ field.id ]: [ value ]
      }
    } || {};

    const canClaim = pathRegistry.executeRecursivelyOnFields(field, ({ field, isClosed }) => {
      const path = pathRegistry.getValuePath(field, options);
      return pathRegistry.canClaimPath(path, isClosed);
    });

    if (!canClaim) {
      return 'Must not cause two binding paths to colide';
    }
  };

  return TextFieldEntry({
    debounce,
    description: 'Where the child variables of this component are pathed to.',
    element: field,
    getValue,
    id,
    label: 'Path',
    tooltip: 'Routes the children of this component into a form variable, may be left empty to route at the root level.',
    setValue,
    validate
  });
}
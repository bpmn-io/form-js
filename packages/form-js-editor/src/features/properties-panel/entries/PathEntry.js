import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import { isProhibitedPath, isValidDotPath, hasIntegerPathSegment } from '../Util';
import { useCallback } from 'preact/hooks';


export function PathEntry(props) {
  const {
    editField,
    field,
    getService
  } = props;

  const {
    type
  } = field;

  const entries = [];

  const formFieldDefinition = getService('formFields').get(type);

  if (formFieldDefinition && formFieldDefinition.config.pathed) {
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
  const fieldConfig = useService('formFields').get(field.type).config;
  const isRepeating = fieldConfig.repeatable && field.isRepeating;

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

  const validate = useCallback((value) => {

    if (!value && isRepeating) {
      return 'Must not be empty';
    }

    // Early return for empty value in non-repeating cases or if the field path hasn't changed
    if (!value && !isRepeating || value === field.path) {
      return null;
    }

    // Validate dot-separated path format
    if (!isValidDotPath(value)) {
      const msg = isRepeating ? 'Must be a variable or a dot-separated path' : 'Must be empty, a variable or a dot-separated path';
      return msg;
    }

    // Check for integer segments in the path
    if (hasIntegerPathSegment(value)) {
      return 'Must not contain numerical path segments.';
    }

    // Check for special prohibited paths
    if (isProhibitedPath(value)) {
      return 'Must not be a prohibited path.';
    }

    // Check for path collisions
    const options = {
      replacements: {
        [field.id]: value.split('.')
      }
    };

    const canClaim = pathRegistry.executeRecursivelyOnFields(field, ({ field, isClosed, isRepeatable }) => {
      const path = pathRegistry.getValuePath(field, options);
      return pathRegistry.canClaimPath(path, { isClosed, isRepeatable, claimerId: field.id });
    });

    if (!canClaim) {
      return 'Must not cause two binding paths to collide';
    }

    // If all checks pass
    return null;
  }, [ field, isRepeating, pathRegistry ]);

  const tooltip = isRepeating
    ? 'Routes the children of this component into a form variable, may be left empty to route at the root level.'
    : 'Routes the children of this component into a form variable.';

  return TextFieldEntry({
    debounce,
    description: 'Where the child variables of this component are pathed to.',
    element: field,
    getValue,
    id,
    label: 'Path',
    tooltip,
    setValue,
    validate
  });
}
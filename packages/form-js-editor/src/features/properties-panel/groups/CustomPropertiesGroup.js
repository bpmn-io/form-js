import { ListGroup } from '@bpmn-io/properties-panel';

import { has } from 'min-dash';

import { CustomValueEntry } from '../entries';

export function CustomPropertiesGroup(field, editField, getService) {
  const { properties = {}, type } = field;

  const translate = getService('translate');

  if (type === 'default') {
    return null;
  }

  const addEntry = (event) => {
    event.stopPropagation();

    let index = Object.keys(properties).length + 1;

    while (`key${index}` in properties) {
      index++;
    }

    editField(field, ['properties'], { ...properties, [`key${index}`]: 'value' });
  };

  const validateFactory = (key) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (typeof value !== 'string' || value.length === 0) {
        return translate('Must not be empty.');
      }

      if (has(properties, value)) {
        return translate('Must be unique.');
      }
    };
  };

  const items = Object.keys(properties).map((key, index) => {
    const removeEntry = (event) => {
      event.stopPropagation();

      return editField(field, ['properties'], removeKey(properties, key));
    };

    const id = `property-${index}`;

    return {
      autoFocusEntry: id + '-key',
      entries: CustomValueEntry({
        editField,
        field,
        idPrefix: id,
        index,
        validateFactory,
      }),
      id,
      label: translate(key || ''),
      remove: removeEntry,
    };
  });

  return {
    add: addEntry,
    component: (props) => ListGroup({ ...props, translate }),
    id: 'custom-values',
    items,
    label: translate('Custom properties'),
    tooltip: translate('Custom properties description'),
  };
}

// helpers //////////

/**
 * Returns copy of object without key.
 *
 * @param {Object} properties
 * @param {string} oldKey
 *
 * @returns {Object}
 */
export function removeKey(properties, oldKey) {
  return Object.entries(properties).reduce((newProperties, entry) => {
    const [key, value] = entry;

    if (key === oldKey) {
      return newProperties;
    }

    return {
      ...newProperties,
      [key]: value,
    };
  }, {});
}

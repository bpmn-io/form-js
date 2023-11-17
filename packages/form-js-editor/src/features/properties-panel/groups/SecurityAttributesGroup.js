import { get, set } from 'min-dash';

import { simpleBoolEntryFactory } from '../entries/factories';

import { SECURITY_ATTRIBUTES_DEFINITIONS } from '@bpmn-io/form-js-viewer';


export function SecurityAttributesGroup(field, editField) {

  const entries = createEntries({ field, editField });

  if (!entries.length) {
    return null;
  }

  return {
    id: 'securityAttributes',
    label: 'Security attributes',
    entries,
    tooltip: getTooltip()
  };
}

function createEntries(props) {
  const {
    editField,
    field
  } = props;

  return SECURITY_ATTRIBUTES_DEFINITIONS.map((definition) => {
    const {
      label,
      property
    } = definition;

    return simpleBoolEntryFactory({
      id: property,
      label: label,
      isDefaultVisible: (field) => field.type === 'iframe',
      path: [ 'security', property ],
      props,
      getValue: () => get(field, [ 'security', property ]),
      setValue: (value) => {
        const security = get(field, [ 'security' ], {});
        editField(field, [ 'security' ], set(security, [ property ], value));
      }
    });
  });
}

// helpers //////////

function getTooltip() {
  return <>
    <p>Allow the iframe to access more functionality of your browser, details regarding the various options can be found in the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe">MDN iFrame documentation.</a></p>
    <p>Be cautious when embedding content from external sources. Ensure you trust the source and are aware of the potential security risks.</p>
  </>;
}
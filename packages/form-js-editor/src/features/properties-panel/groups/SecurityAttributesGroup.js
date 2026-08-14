import { get, set } from 'min-dash';

import { simpleBoolEntryFactory } from '../entries/factories';

import { SECURITY_ATTRIBUTES_DEFINITIONS } from '@bpmn-io/form-js-viewer';

export function SecurityAttributesGroup(field, editField, getService) {
  const { type } = field;

  const translate = getService('translate');

  if (type !== 'iframe') {
    return null;
  }

  const entries = createEntries({ field, editField, translate });

  if (!entries.length) {
    return null;
  }

  return {
    id: 'securityAttributes',
    label: translate('Security attributes'),
    entries,
    tooltip: getTooltip(translate),
  };
}

function createEntries(props) {
  const { editField, field, translate } = props;

  const securityEntries = SECURITY_ATTRIBUTES_DEFINITIONS.map((definition) => {
    const { label, property } = definition;

    return simpleBoolEntryFactory({
      id: property,
      label: translate(label),
      isDefaultVisible: (field) => field.type === 'iframe',
      path: ['security', property],
      props,
      getValue: () => get(field, ['security', property]),
      setValue: (value) => {
        const security = get(field, ['security'], {});
        editField(field, ['security'], set(security, [property], value));
      },
    });
  });

  return [{ component: () => Advisory({ translate }) }, ...securityEntries];
}

const Advisory = (props) => {
  const { translate } = props;
  return (
    <div class="bio-properties-panel-description fjs-properties-panel-detached-description">
      {translate(
        'These options can incur security risks, especially if used in combination with dynamic links. Ensure that you are aware of them, that you trust the source url and only enable what your use case requires.',
      )}
    </div>
  );
};

// helpers //////////

function getTooltip(translate) {
  return (
    <>
      <p>
        {translate(
          'Allow the iframe to access more functionality of your browser, details regarding the various options can be found in the',
        )}{' '}
        <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe" rel="noreferrer">
          {translate('MDN iFrame documentation.')}
        </a>
      </p>
    </>
  );
}

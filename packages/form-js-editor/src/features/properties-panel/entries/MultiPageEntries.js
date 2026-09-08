import { simpleBoolEntryFactory } from './factories';

export function MultiPageEntries(props) {
  const { field, translate } = props;

  if (field.type !== 'multipage') {
    return [];
  }

  return [
    simpleBoolEntryFactory({
      id: 'showSubmit',
      path: ['showSubmit'],
      label: translate('Show submit button'),
      description: translate('Shown on the last page in view.'),
      props,
    }),
    simpleBoolEntryFactory({
      id: 'disableInvalidNavigation',
      path: ['disableInvalidNavigation'],
      label: translate('Disable navigation on an invalid page'),
      description: translate('Marks the next and submit controls as disabled while the page in view has errors.'),
      props,
    }),
  ];
}

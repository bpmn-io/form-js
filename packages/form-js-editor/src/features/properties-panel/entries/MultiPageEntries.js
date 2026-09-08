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
      id: 'requireValidPage',
      path: ['requireValidPage'],
      label: translate('Require a valid page to continue'),
      description: translate('Blocks the navigation controls until the page in view validates.'),
      props,
    }),
  ];
}

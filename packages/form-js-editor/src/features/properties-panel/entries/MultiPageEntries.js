import { simpleBoolEntryFactory } from './factories';

export function MultiPageEntries(props) {
  const { field } = props;

  if (field.type !== 'multipage') {
    return [];
  }

  return [
    simpleBoolEntryFactory({
      id: 'showSubmit',
      path: ['showSubmit'],
      label: 'Show submit button',
      description: 'Shown on the last page in view.',
      props,
    }),
    simpleBoolEntryFactory({
      id: 'requireValidPage',
      path: ['requireValidPage'],
      label: 'Require a valid page to continue',
      description: 'Blocks the navigation controls until the page in view validates.',
      props,
    }),
  ];
}

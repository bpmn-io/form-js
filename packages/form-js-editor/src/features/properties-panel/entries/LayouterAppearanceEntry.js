import { simpleSelectEntryFactory } from './factories';

export default function LayouterAppearanceEntry(props) {
  const {
    field
  } = props;

  if (![ 'group', 'dynamiclist' ].includes(field.type)) {
    return [];
  }

  const entries = [
    simpleSelectEntryFactory({
      id: 'verticalAlignment',
      path: [ 'verticalAlignment' ],
      label: 'Vertical alignment',
      optionsArray: [
        { value: 'start', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'Bottom' }
      ],
      props
    }),
  ];

  return entries;
}
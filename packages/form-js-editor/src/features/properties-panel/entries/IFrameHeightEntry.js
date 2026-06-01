import { HeightEntry } from './HeightEntry';

export function IFrameHeightEntry(props) {
  const translate = props.getService('translate');

  return [
    ...HeightEntry({
      ...props,
      description: translate('Height of the container in pixels.'),
      isDefaultVisible: (field) => field.type === 'iframe',
    }),
  ];
}

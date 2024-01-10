import { HeightEntry } from './HeightEntry';

export function IFrameHeightEntry(props) {
  return [
    ...HeightEntry({
      ...props,
      defaultValue: 300,
      description: 'Height of the container in pixels.',
      isDefaultVisible: (field) => field.type === 'iframe'
    })
  ];
}
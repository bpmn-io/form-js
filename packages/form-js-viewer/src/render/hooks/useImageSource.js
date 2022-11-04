import { get } from 'min-dash';

import { useEffect, useState } from 'preact/hooks';

import useService from './useService';

export function useImageSource(field) {
  const {
    defaultValue,
    source: sourceKey
  } = field;

  const [ source, setSource ] = useState('');
  const formData = useService('form')._getState().data;

  // todo(pinussilvestrus): support FEEL expressions
  useEffect(() => {
    const dataSource = get(formData, [ sourceKey ]);
    setSource(dataSource || defaultValue);
  }, [ defaultValue, formData, sourceKey ]);

  return { source };
}

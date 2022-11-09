import { get } from 'min-dash';

import { useEffect, useState } from 'preact/hooks';

import useService from './useService';

export function useText(field) {
  const {
    text: staticText,
    textRef
  } = field;

  const [ text, setText ] = useState('');
  const formData = useService('form')._getState().data;

  // todo(skaiir): ditch in favor of FEEL when we have it
  useEffect(() => {
    const refData = get(formData, [ textRef ]);
    setText((typeof refData === 'string' && refData) || staticText || '');
  }, [ formData, staticText, textRef ]);

  return text;
}

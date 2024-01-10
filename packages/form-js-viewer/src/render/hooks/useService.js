import {
  useContext
} from 'preact/hooks';

import { FormContext } from '../context';

export function useService(type, strict) {
  const {
    getService
  } = useContext(FormContext);

  return getService(type, strict);
}
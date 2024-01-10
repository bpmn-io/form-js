import {
  useContext
} from 'preact/hooks';

import { FormEditorContext } from '../context';


export function useService(type, strict) {
  const {
    getService
  } = useContext(FormEditorContext);

  return getService(type, strict);
}
import {
  useContext
} from 'preact/hooks';

import { FormPropertiesPanelContext } from '../context';


export function useService(type, strict) {
  const {
    getService
  } = useContext(FormPropertiesPanelContext);

  return getService(type, strict);
}
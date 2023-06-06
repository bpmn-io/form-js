import {
  useContext
} from 'preact/hooks';

import { FormPropertiesPanelContext } from '../context';


export default function(type, strict) {
  const {
    getService
  } = useContext(FormPropertiesPanelContext);

  return getService(type, strict);
}
import {
  useContext
} from 'preact/hooks';

import { FormEditorContext } from '../context';


export default function(type, strict) {
  const {
    getService
  } = useContext(FormEditorContext);

  return getService(type, strict);
}
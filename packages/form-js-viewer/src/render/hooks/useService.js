import {
  useContext
} from 'preact/hooks';

import { FormContext } from '../context';


export default function(type, strict) {
  const {
    getService
  } = useContext(FormContext);

  return getService(type, strict);
}
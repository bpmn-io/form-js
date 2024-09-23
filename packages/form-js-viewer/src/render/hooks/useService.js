import { useContext } from 'preact/hooks';

import { FormContext } from '../context';

/**
 * @template T
 * @param {string} type
 * @param {boolean} [strict=true]
 * @returns {T | null}
 */
export function useService(type, strict) {
  const { getService } = useContext(FormContext);

  return getService(type, strict);
}

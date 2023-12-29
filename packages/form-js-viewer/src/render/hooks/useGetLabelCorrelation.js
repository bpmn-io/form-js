import { useCallback, useMemo } from 'preact/hooks';
import { isObject } from 'min-dash';

/**
 * This hook allows us to retrieve the label from a value in linear time by caching it in a map
 * @param {Array} options
 */
export function useGetLabelCorrelation(options) {

  // This allows us to retrieve the label from a value in linear time
  const labelMap = useMemo(() => Object.assign({}, ...options.map((o) => ({ [_getValueHash(o.value)]:  o.label }))), [ options ]);
  return useCallback((value) => labelMap[_getValueHash(value)], [ labelMap ]);
}

const _getValueHash = (value) => {
  return isObject(value) ? JSON.stringify(value) : value;
};
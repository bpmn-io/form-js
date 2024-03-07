import { useMemo } from 'react';
import { isObject } from 'min-dash';

function useLookUpTable(object, keyFn, valueFn) {
  return useMemo(() => {
    const toKey = value => isObject(value) ? JSON.stringify(value) : value;
    const map = new Map(object.map((item, i) => [ toKey(keyFn(item, i)), valueFn(item, i) ]));
    return (key, defaultValue = undefined) => {
      const value = map.get(toKey(key));
      if (value === undefined) {
        return defaultValue;
      }
      return value;
    };
  }, [ keyFn, object, valueFn ]);
}

export { useLookUpTable };
import { useEffect } from 'preact/hooks';
import { LOAD_STATES } from './useOptionsAsync';
import { hasEqualValue } from '../components/util/sanitizerUtil';
import { useDeepCompareMemoize } from './useDeepCompareMemoize';

export function useCleanupMultiSelectValue(props) {

  const {
    field,
    options,
    loadState,
    onChange,
    values
  } = props;

  const memoizedValues = useDeepCompareMemoize(values || []);

  // ensures that the values are always a subset of the possible options
  useEffect(() => {

    if (loadState !== LOAD_STATES.LOADED) {
      return;
    }

    const optionValues = options.map(o => o.value);
    const hasValuesNotInOptions = memoizedValues.some(v => !hasEqualValue(v, optionValues));

    if (hasValuesNotInOptions) {
      onChange({
        field,
        value: memoizedValues.filter(v => hasEqualValue(v, optionValues))
      });
    }

  }, [ field, options, onChange, memoizedValues, loadState ]);

}
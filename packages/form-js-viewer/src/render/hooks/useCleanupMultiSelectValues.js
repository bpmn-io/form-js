import { useEffect } from 'preact/hooks';
import { LOAD_STATES } from './useOptionsAsync';
import { hasEqualValue } from '../components/util/sanitizerUtil';
import useDeepCompareState from './useDeepCompareState';

export default function(props) {

  const {
    field,
    options,
    loadState,
    onChange,
    values: valuesArray
  } = props;

  const values = useDeepCompareState(valuesArray, []);

  // ensures that the values are always a subset of the possible options
  useEffect(() => {

    if (loadState !== LOAD_STATES.LOADED) {
      return;
    }

    const optionValues = options.map(o => o.value);
    const hasValuesNotInOptions = values.some(v => !hasEqualValue(v, optionValues));

    if (hasValuesNotInOptions) {
      onChange({
        field,
        value: values.filter(v => hasEqualValue(v, optionValues))
      });
    }

  }, [ field, options, onChange, values, loadState ]);

}
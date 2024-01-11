import { useEffect } from 'preact/hooks';
import { LOAD_STATES } from './useOptionsAsync';
import { hasEqualValue } from '../components/util/sanitizerUtil';

export function useCleanupSingleSelectValue(props) {

  const {
    field,
    options,
    loadState,
    onChange,
    value
  } = props;

  // Ensures that the value is always one of the possible options
  useEffect(() => {

    if (loadState !== LOAD_STATES.LOADED) {
      return;
    }

    const optionValues = options.map(o => o.value);
    const hasValueNotInOptions = value && !hasEqualValue(value, optionValues);

    if (hasValueNotInOptions) {
      onChange({
        field,
        value: null
      });
    }

  }, [ field, options, onChange, value, loadState ]);

}
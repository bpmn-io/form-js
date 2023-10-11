import { useEffect } from 'preact/hooks';
import { LOAD_STATES } from './useOptionsAsync';

export default function(props) {

  const {
    field,
    options,
    loadState,
    onChange,
    values
  } = props;

  // Ensures that the values are always a subset of the possible options
  useEffect(() => {

    if (loadState !== LOAD_STATES.LOADED) {
      return;
    }

    const hasValuesNotInOptions = values.some(v => !options.map(o => o.value).includes(v));

    if (hasValuesNotInOptions) {
      onChange({
        field,
        value: values.filter(v => options.map(o => o.value).includes(v))
      });
    }

  }, [ field, options, onChange, JSON.stringify(values), loadState ]);

}
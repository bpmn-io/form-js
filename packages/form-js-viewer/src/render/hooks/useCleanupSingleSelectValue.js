import { useEffect } from 'preact/hooks';
import { LOAD_STATES } from './useOptionsAsync';

export default function(props) {

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

    const hasValueNotInOptions = value && !options.map(o => o.value).includes(value);

    if (hasValueNotInOptions) {
      onChange({
        field,
        value: null
      });
    }

  }, [ field, options, onChange, value, loadState ]);

}
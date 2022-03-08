import { useEffect, useState } from 'preact/hooks';

import { useDebounce, usePrevious } from '../../../hooks';
import { prefixId } from '../Util';


export default function FileInput(props) {

  let {
    id,
    label,
    validate = () => null,
    onInput: _onInput,
    value = ''
  } = props;

  const prevValue = usePrevious(value);

  const [ cachedValue, setCachedValue ] = useState(null);

  const [ error, setError ] = useState(null);

  useEffect(() => setError(validate(value)), [ validate, value ]);

  const onInput = useDebounce(event => {

    const value = event.target.value;

    const error = validate(value);

    if (error) {
      setCachedValue(value);
    } else {
      _onInput(value.length ? value : undefined);
    }

    setError(error);
  }, [ validate, setCachedValue, _onInput ]);


  if (prevValue === value && error) {
    value = cachedValue;
  }

  const classes = [ 'fjs-properties-panel-input' ];

  if (error) {
    classes.push('fjs-has-error');
  }

  return (
    <div class="fjs-properties-panel-text">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <input
        id={ prefixId(id) }
        type="file"
        spellcheck={ false }
        class={ classes.join(' ') }
        onInput={ onInput }
        value={ value } />
      {
        error && <div class="fjs-properties-panel-error">{ error }</div>
      }
    </div>
  );
}
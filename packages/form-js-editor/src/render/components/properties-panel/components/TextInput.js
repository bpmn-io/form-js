import {
  useEffect,
  useState
} from 'preact/hooks';

import { prefixId } from '../Util';

import usePrevious from '../../../hooks/usePrevious';
import useService from '../../../hooks/useService';

export default function TextInput(props) {
  const debounce = useService('debounce'),
        eventBus = useService('eventBus');

  let {
    id,
    label,
    validate = () => null,
    value = ''
  } = props;

  const prevValue = usePrevious(value);

  const [ cachedValue, setCachedValue ] = useState(null);

  const [ error, setError ] = useState(null);

  useEffect(() => setError(validate(value)), [ value ]);

  const onInput = debounce(event => {
    const value = event.target.value;

    const error = validate(value);

    if (error) {
      setCachedValue(value);
    } else {
      props.onInput(value.length ? value : undefined);
    }

    setError(error);
  });

  if (prevValue === value && error) {
    value = cachedValue;
  }

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const classes = [ 'fjs-properties-panel-input' ];

  if (error) {
    classes.push('fjs-has-error');
  }

  return (
    <div class="fjs-properties-panel-textfield">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <input
        id={ prefixId(id) }
        type="text"
        spellcheck={ false }
        class={ classes.join(' ') }
        onInput={ onInput }
        onFocus={ onFocus }
        onBlur={ onBlur }
        value={ value } />
      {
        error && <div class="fjs-properties-panel-error">{ error }</div>
      }
    </div>
  );
}
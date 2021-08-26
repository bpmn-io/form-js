import {
  useEffect,
  useState
} from 'preact/hooks';

import { prefixId } from '../Util';

import {
  usePrevious,
  useService,
  useDebounce
} from '../../../hooks';


export default function TextInput(props) {
  const eventBus = useService('eventBus');

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

  useEffect(() => setError(validate(value)), [ value ]);

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
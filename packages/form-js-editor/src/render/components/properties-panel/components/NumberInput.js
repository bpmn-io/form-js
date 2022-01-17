import { prefixId } from '../Util';

import {
  useDebounce
} from '../../../hooks';

export default function NumberInput(props) {

  const {
    id,
    label,
    max,
    min,
    value = '',
    onInput: _onInput
  } = props;

  const onInput = useDebounce(event => {

    const {
      validity,
      value
    } = event.target;

    if (validity.valid) {
      _onInput(value ? parseInt(value, 10) : undefined);
    }
  }, [ _onInput ]);

  return (
    <div class="fjs-properties-panel-number">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <input
        id={ prefixId(id) }
        type="number"
        class="fjs-properties-panel-input"
        max={ max }
        min={ min }
        onInput={ onInput }
        value={ value } />
    </div>
  );
}
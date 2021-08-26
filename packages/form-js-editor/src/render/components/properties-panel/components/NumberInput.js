import { prefixId } from '../Util';

import {
  useDebounce,
  useService
} from '../../../hooks';

export default function NumberInput(props) {
  const eventBus = useService('eventBus');

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

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  return (
    <div class="fjs-properties-panel-textfield">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <input
        id={ prefixId(id) }
        type="number"
        class="fjs-properties-panel-input"
        max={ max }
        min={ min }
        onInput={ onInput }
        onFocus={ onFocus }
        onBlur={ onBlur }
        value={ value } />
    </div>
  );
}
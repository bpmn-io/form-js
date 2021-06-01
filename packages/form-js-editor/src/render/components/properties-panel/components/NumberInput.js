import {
  debounce,
  prefixId
} from '../Util.js';

import useService from '../../../hooks/useService';

export default function NumberInput(props) {
  const eventBus = useService('eventBus');

  const {
    id,
    label,
    max,
    min,
    value = '',
  } = props;

  const debouncedOnInput = debounce(props.onInput);

  const handleInput = ({ target }) => {
    const {
      validity,
      value
    } = target;

    if (validity.valid) {
      debouncedOnInput(value ? parseInt(value, 10) : undefined);
    }
  };

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
        onInput={ handleInput }
        onFocus={ onFocus }
        onBlur={ onBlur }
        value={ value } />
    </div>
  );
}
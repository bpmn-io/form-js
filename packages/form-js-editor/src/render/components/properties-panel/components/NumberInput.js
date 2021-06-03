import { prefixId } from '../Util';

import useService from '../../../hooks/useService';

export default function NumberInput(props) {
  const debounce = useService('debounce'),
        eventBus = useService('eventBus');

  const {
    id,
    label,
    max,
    min,
    value = '',
  } = props;

  const onInput = debounce(event => {

    const {
      validity,
      value
    } = event.target;

    if (validity.valid) {
      props.onInput(value ? parseInt(value, 10) : undefined);
    }
  });

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
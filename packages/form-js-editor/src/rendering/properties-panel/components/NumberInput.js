import { useContext } from 'preact/hooks';

import { debounce } from '../Util.js';

import { FormEditorContext } from '../../context';

import { prefixId } from '../Util';

export default function NumberInput(props) {
  const { emit } = useContext(FormEditorContext);

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

  const onFocus = () => emit('propertiesPanel.focusin');

  const onBlur = () => emit('propertiesPanel.focusout');

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
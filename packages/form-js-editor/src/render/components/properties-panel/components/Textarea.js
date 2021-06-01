import {
  debounce,
  prefixId
} from '../Util';

import useService from '../../../hooks/useService';

export default function Textarea(props) {
  const eventBus = useService('eventBus');

  const {
    id,
    label,
    rows = 10,
    value = ''
  } = props;

  const debouncedOnInput = debounce(props.onInput);

  const onInput = ({ target }) => {
    debouncedOnInput(target.value.length ? target.value : undefined);
  };

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  return (
    <div class="fjs-properties-panel-textfield">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <textarea
        id={ prefixId(id) }
        spellcheck={ false }
        class="fjs-properties-panel-input"
        onInput={ onInput }
        onFocus={ onFocus }
        onBlur={ onBlur }
        rows={ rows }
        value={ value } />
    </div>
  );
}
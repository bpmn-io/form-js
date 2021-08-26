import { prefixId } from '../Util';

import {
  useDebounce,
  useService
} from '../../../hooks';


export default function Textarea(props) {
  const eventBus = useService('eventBus');

  const {
    id,
    label,
    rows = 10,
    value = '',
    onInput: _onInput
  } = props;

  const onInput = useDebounce(event => {
    const value = event.target.value;

    _onInput(value.length ? value : undefined);
  }, [ _onInput ]);

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
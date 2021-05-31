import { useContext } from 'preact/hooks';

import { debounce } from '../Util';

import { FormEditorContext } from '../../context';

import { prefixId } from '../Util';

export default function Textarea(props) {
  const { emit } = useContext(FormEditorContext);

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

  const onFocus = () => emit('propertiesPanel.focusin');

  const onBlur = () => emit('propertiesPanel.focusout');

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
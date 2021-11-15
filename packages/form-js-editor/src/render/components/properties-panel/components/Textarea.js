import { prefixId } from '../Util';

import {
  useDebounce
} from '../../../hooks';


export default function Textarea(props) {

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

  return (
    <div class="fjs-properties-panel-textarea">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <textarea
        id={ prefixId(id) }
        spellcheck={ false }
        class="fjs-properties-panel-input"
        onInput={ onInput }
        rows={ rows }
        value={ value } />
    </div>
  );
}
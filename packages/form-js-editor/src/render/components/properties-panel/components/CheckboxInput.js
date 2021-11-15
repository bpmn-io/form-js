import { prefixId } from '../Util';

export default function CheckboxInput(props) {
  const {
    id,
    label,
    onChange,
    value = false
  } = props;

  const handleChange = ({ target }) => {
    onChange(target.checked);
  };

  return (
    <div class="fjs-properties-panel-checkbox">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <input
        id={ prefixId(id) }
        type="checkbox"
        class="fjs-properties-panel-input"
        onChange={ handleChange }
        checked={ value } />
    </div>
  );
}
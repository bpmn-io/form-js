import { prefixId } from '../Util';

export default function Select(props) {
  const {
    id,
    label,
    onChange,
    options,
    value
  } = props;

  const handleChange = ({ target }) => {
    onChange(target.value);
  };

  return (
    <div class="fjs-properties-panel-select">
      <label for={ prefixId(id) } class="fjs-properties-panel-label">{ label }</label>
      <select id={ prefixId(id) } class="fjs-properties-panel-input" onInput={ handleChange }>
        {
          options.map((option) => {
            return (
              <option
                value={ option.value }
                selected={ option.value === value }>
                { option.label }
              </option>
            );
          })
        }
      </select>
    </div>
  );
}
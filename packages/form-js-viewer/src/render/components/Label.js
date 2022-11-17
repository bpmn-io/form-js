import classNames from 'classnames';

export default function Label(props) {
  const {
    id,
    label,
    required = false
  } = props;

  return (
    <label for={ id } class={ classNames('fjs-form-field-label', props['class']) }>
      { props.children }
      { label || '' }
      {
        required && <span class="fjs-asterix">*</span>
      }
    </label>
  );
}
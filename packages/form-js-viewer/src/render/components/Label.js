import classNames from 'classnames';

export default function Label(props) {
  const {
    id,
    label,
    collapseOnEmpty = true,
    required = false
  } = props;

  return (
    <label for={ id } class={ classNames('fjs-form-field-label', { 'fjs-incollapsible-label': !collapseOnEmpty }, props['class']) }>
      { props.children }
      { label || '' }
      {
        required && <span class="fjs-asterix">*</span>
      }
    </label>
  );
}
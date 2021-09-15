export default function Label(props) {
  const {
    id,
    label,
    required = false
  } = props;

  return (
    <label for={ id } class="fjs-form-field-label">
      { props.children }
      { label || '' }
      {
        required && <span class="fjs-asterix">*</span>
      }
    </label>
  );
}
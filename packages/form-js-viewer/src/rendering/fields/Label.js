export default function Label(props) {
  const {
    label = 'Form Field',
    required = false
  } = props;

  return <label class="fjs-form-field-label">
    { props.children }
    { label }
    {
      required && <span class="fjs-asterix">*</span>
    }
  </label>;
}
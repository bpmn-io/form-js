export default function Description(props) {
  const { description } = props;

  if (!description) {
    return null;
  }

  return <div class="fjs-form-field-description">{ description }</div>;
}
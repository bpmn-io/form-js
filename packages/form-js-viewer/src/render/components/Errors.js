export default function Errors(props) {
  const { errors, id } = props;

  if (!errors.length) {
    return null;
  }

  return <div class="fjs-form-field-error" aria-live="polite" id={ id }>
    <ul>
      {
        errors.map(error => {
          return <li>{ error }</li>;
        })
      }
    </ul>
  </div>;
}
export default function Errors(props) {
  const { errors } = props;

  if (!errors.length) {
    return null;
  }

  return <div class="fjs-form-field-error">
    <ul>
      {
        errors.map(error => {
          return <li>{ error }</li>;
        })
      }
    </ul>
  </div>;
}
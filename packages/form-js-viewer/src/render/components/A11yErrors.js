export default function A11yErrors(props) {
  const { a11yErrors, id } = props;

  if (!a11yErrors.length) {
    return null;
  }

  return <div class="fjs-form-field-a11y-error" aria-live="polite" id={ id }>
    <ul>
      {
        a11yErrors.map(error => {
          return <li>{error.impact}: { error.help } (<a href={ error.helpUrl } target="_blank">More</a>)</li>;
        })
      }
    </ul>
  </div>;
}
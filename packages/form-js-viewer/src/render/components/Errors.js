/**
 * @typedef Props
 * @property {string} id
 * @property {string[]} errors
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function Errors(props) {
  const { errors, id } = props;

  if (!errors.length) {
    return null;
  }

  return (
    <div class="fjs-form-field-error" aria-live="polite" id={id}>
      <ul>
        {errors.map((error, index) => {
          return <li key={index}>{error}</li>;
        })}
      </ul>
    </div>
  );
}

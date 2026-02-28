/**
 * @typedef Props
 * @property {string} id
 * @property {string[]} warnings
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function Warning(props) {
  const { warnings, id } = props;

  if (!warnings.length) {
    return null;
  }

  return (
    <div class="fjs-form-field-warning" aria-live="polite" id={id}>
      <ul>
        {warnings.map((warning, index) => {
          return <li key={index}>{warning}</li>;
        })}
      </ul>
    </div>
  );
}

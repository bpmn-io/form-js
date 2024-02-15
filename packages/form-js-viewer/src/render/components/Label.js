import classNames from 'classnames';

import { useSingleLineTemplateEvaluation } from '../hooks';


/**
 * @typedef Props
 * @property {string|undefined} [id]
 * @property {string|undefined} [htmlFor]
 * @property {string|undefined} label
 * @property {string} [class]
 * @property {boolean} [collapseOnEmpty]
 * @property {boolean} [required]
 * @property {import("preact").VNode} [children]
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function Label(props) {
  const {
    id,
    htmlFor,
    label,
    collapseOnEmpty = true,
    required = false
  } = props;

  const evaluatedLabel = useSingleLineTemplateEvaluation(label || '', { debug: true });

  return (
    <label id={ id } for={ htmlFor } class={ classNames('fjs-form-field-label', { 'fjs-incollapsible-label': !collapseOnEmpty }, props['class']) }>
      { props.children }
      { evaluatedLabel }
      {
        required && <span class="fjs-asterix" aria-hidden>*</span>
      }
    </label>
  );
}
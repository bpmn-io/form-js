import classNames from 'classnames';

import { useSingleLineTemplateEvaluation } from '../hooks';

export default function Label(props) {
  const {
    id,
    label,
    collapseOnEmpty = true,
    required = false
  } = props;

  const evaluatedLabel = useSingleLineTemplateEvaluation(label || '', { debug: true });

  return (
    <label for={ id } class={ classNames('fjs-form-field-label', { 'fjs-incollapsible-label': !collapseOnEmpty }, props['class']) }>
      { props.children }
      { evaluatedLabel }
      {
        required && <span class="fjs-asterix">*</span>
      }
    </label>
  );
}
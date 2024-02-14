import { useSingleLineTemplateEvaluation } from '../hooks';


export function Description(props) {
  const { description, id } = props;

  const evaluatedDescription = useSingleLineTemplateEvaluation(description || '', { debug: true });

  if (!evaluatedDescription) {
    return null;
  }

  return <div id={ id } class="fjs-form-field-description">{ evaluatedDescription }</div>;
}
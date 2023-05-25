import { useSingleLineTemplateEvaluation } from '../hooks';


export default function Description(props) {
  const { description } = props;

  const evaluatedDescription = useSingleLineTemplateEvaluation(description || '', { debug: true });

  if (!evaluatedDescription) {
    return null;
  }

  return <div class="fjs-form-field-description">{ evaluatedDescription }</div>;
}
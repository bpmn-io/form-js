import { InputAdorner } from './InputAdorner';

import { useSingleLineTemplateEvaluation } from '../../../hooks';

export function TemplatedInputAdorner(props) {

  const {
    pre,
    post
  } = props;

  const evaluatedPre = useSingleLineTemplateEvaluation(pre, { debug: true });
  const evaluatedPost = useSingleLineTemplateEvaluation(post, { debug: true });

  return <InputAdorner { ...props } pre={ evaluatedPre } post={ evaluatedPost } />;

}
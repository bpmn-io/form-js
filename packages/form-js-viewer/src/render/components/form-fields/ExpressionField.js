import { useCallback, useEffect } from 'preact/hooks';
import { useExpressionEvaluation, useDeepCompareMemoize, useService, useEffectOnChange } from '../../hooks';

const type = 'expression';

export function ExpressionField(props) {
  const {
    field,
    onChange,
  } = props;

  const {
    computeOn,
    expression
  } = field;

  const evaluation = useExpressionEvaluation(expression);
  const evaluationMemo = useDeepCompareMemoize(evaluation);
  const eventBus = useService('eventBus');

  const sendValue = useCallback(() => {
    onChange && onChange({ field, value: evaluationMemo });
  }, [ field, evaluationMemo, onChange ]);

  useEffectOnChange(evaluationMemo, () => {
    if (computeOn !== 'change') { return; }
    sendValue();
  }, [ computeOn, sendValue ]);

  useEffect(() => {
    if (computeOn === 'presubmit') {
      eventBus.on('presubmit', sendValue);
      return () => eventBus.off('presubmit', sendValue);
    }
  }, [ computeOn, sendValue, eventBus ]);

  return null;
}

ExpressionField.config = {
  type,
  label: 'Expression',
  group: 'basic-input',
  keyed: true,
  escapeGridRender: true,
  create: (options = {}) => ({
    computeOn: 'change',
    ...options,
  })
};
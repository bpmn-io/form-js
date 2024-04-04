import { useCallback, useEffect } from 'preact/hooks';
import { useExpressionEvaluation, useDeepCompareMemoize, useService } from '../../hooks';

const type = 'expression';

export function ExpressionField(props) {
  const {
    field,
    onChange,
    value
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

  useEffect(() => {
    if (computeOn !== 'change' || evaluationMemo === value) { return; }
    sendValue();
  }, [ computeOn, evaluationMemo, sendValue, value ]);

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
  emptyValue: null,
  escapeGridRender: true,
  create: (options = {}) => ({
    computeOn: 'change',
    ...options,
  })
};
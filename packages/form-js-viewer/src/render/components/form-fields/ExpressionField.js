import { useCallback, useEffect } from 'preact/hooks';
import { useExpressionEvaluation, useDeepCompareMemoize, useService } from '../../hooks';

import { isEqual } from 'lodash';

const type = 'expression';

export function ExpressionField(props) {
  const { field, onChange, value } = props;

  const { computeOn, expression } = field;

  const evaluation = useExpressionEvaluation(expression);
  const evaluationMemo = useDeepCompareMemoize(evaluation);
  const eventBus = useService('eventBus');
  const expressionLoopPreventer = useService('expressionLoopPreventer');

  const sendValue = useCallback(() => {
    onChange && onChange({ field, value: evaluationMemo, shouldNotRecompute: true });
  }, [field, evaluationMemo, onChange]);

  useEffect(() => {
    if (
      computeOn !== 'change' ||
      isEqual(evaluationMemo, value) ||
      !expressionLoopPreventer.registerExpressionExecution(this)
    ) {
      return;
    }
    sendValue();
  });

  useEffect(() => {
    if (computeOn === 'presubmit') {
      eventBus.on('presubmit', sendValue);
      return () => eventBus.off('presubmit', sendValue);
    }
  }, [computeOn, sendValue, eventBus]);

  return null;
}

ExpressionField.config = {
  type,
  label: 'Expression',
  group: 'basic-input',
  keyed: true,
  validatable: false,
  emptyValue: null,
  escapeGridRender: true,
  create: (options = {}) => ({
    computeOn: 'change',
    ...options,
  }),
};

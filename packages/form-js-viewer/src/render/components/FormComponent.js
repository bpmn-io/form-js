import { FormField } from './FormField';
import { PoweredBy } from './PoweredBy';
import { ExpressionContextInfo } from '../context/ExpressionContextInfo';

import { useMemo } from 'preact/hooks';
import { useDeepCompareMemoize, useFilteredFormData, useService } from '../hooks';

const noop = () => {};

export function FormComponent(props) {
  const form = useService('form');

  const { schema, properties } = form._getState();

  const { ariaLabel } = properties;

  const { onSubmit = noop, onReset = noop, onChange = noop } = props;

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit();
  };

  const handleReset = (event) => {
    event.preventDefault();

    onReset();
  };

  const _filteredFormData = useFilteredFormData();
  const filteredFormData = useDeepCompareMemoize(_filteredFormData);

  const expressionContextInfo = useMemo(
    () => ({
      data: filteredFormData,
      segments: [],
    }),
    [filteredFormData],
  );

  return (
    <form class="fjs-form" onSubmit={handleSubmit} onReset={handleReset} aria-label={ariaLabel} noValidate>
      <ExpressionContextInfo.Provider value={expressionContextInfo}>
        <FormField field={schema} onChange={onChange} />
      </ExpressionContextInfo.Provider>
      <PoweredBy />
    </form>
  );
}

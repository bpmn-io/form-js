import { FormField } from './FormField';
import { PoweredBy } from './PoweredBy';
import { LocalExpressionContext } from '../context/LocalExpressionContext';

import { useMemo } from 'preact/hooks';
import { useFilteredFormData, useService } from '../hooks';

const noop = () => {};

export function FormComponent(props) {
  const form = useService('form');

  const { schema, properties } = form._getState();

  const { ariaLabel } = properties;

  const {
    onSubmit = noop,
    onReset = noop,
    onChange = noop,
  } = props;

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit();
  };

  const handleReset = (event) => {
    event.preventDefault();

    onReset();
  };

  const filteredFormData = useFilteredFormData();

  const localExpressionContext = useMemo(() => ({
    data: filteredFormData,
    parent: null,
    this: filteredFormData,
    i: []
  }), [ filteredFormData ]);

  return (
    <form
      class="fjs-form"
      onSubmit={ handleSubmit }
      onReset={ handleReset }
      aria-label={ ariaLabel }
      noValidate
    >
      <LocalExpressionContext.Provider value={ localExpressionContext }>
        <FormField
          field={ schema }
          onChange={ onChange }
        />
      </LocalExpressionContext.Provider>
      <PoweredBy />
    </form>
  );
}
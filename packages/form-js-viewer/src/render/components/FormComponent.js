import FormField from './FormField';

import PoweredBy from './PoweredBy';

import useService from '../hooks/useService';

import { FilteredFormDataProvider } from '../context/FilteredFormDataContextProvider';

const noop = () => {};

export default function FormComponent(props) {
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

  return (
    <FilteredFormDataProvider>
      <form
        class="fjs-form"
        onSubmit={ handleSubmit }
        onReset={ handleReset }
        aria-label={ ariaLabel }
        noValidate
      >
        <FormField
          field={ schema }
          onChange={ onChange }
        />

        <PoweredBy />
      </form>
    </FilteredFormDataProvider>
  );
}
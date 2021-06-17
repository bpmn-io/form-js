import FormField from './FormField';

import PoweredBy from './PoweredBy';

import useService from '../hooks/useService';

const noop = () => {};

export default function FormComponent(props) {
  const form = useService('form');

  const { schema } = form._getState();

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
    <form
      class="fjs-form"
      onSubmit={ handleSubmit }
      onReset={ handleReset }
    >
      <FormField
        field={ schema }
        onChange={ onChange }
      />

      <PoweredBy />
    </form>
  );
}
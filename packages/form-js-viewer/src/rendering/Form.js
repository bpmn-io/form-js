import FormElement from './FormElement';

import PoweredBy from './PoweredBy';

const noop = () => {};

export default function Form(props) {

  const {
    onSubmit = noop,
    onReset = noop,
    onChange = noop,
    schema
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
      <FormElement
        field={ schema }
        onChange={ onChange }
        path={ [] }
      />

      <PoweredBy />
    </form>
  );
}
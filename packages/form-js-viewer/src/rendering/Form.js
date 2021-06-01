import { useContext } from 'preact/hooks';

import FormElement from './FormElement';

import PoweredBy from './PoweredBy';

import { FormContext } from './context';

const noop = () => {};

export default function Form(props) {
  const { schema } = useContext(FormContext);

  const {
    onSubmit = noop,
    onReset = noop,
    onChange = noop
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
import FormElement from './FormElement';

import PoweredBy from './PoweredBy';

import { mergeProps } from 'solid-js';


const noop = () => {};

export default function Form(props) {

  const mergedProps = mergeProps({
    onSubmit: noop,
    onReset: noop,
    onChange: noop
  }, props);

  return (
    <form
      class="fjs-viewer"
      onSubmit={ (e) => { e.preventDefault(); mergedProps.onSubmit(); } }
      onReset={ (e) => { e.preventDefault(); mergedProps.onReset(); } }
    >
      <FormElement
        field={ mergedProps.schema }
        onChange={ mergedProps.onChange }
        dataPath={ [] }
        schemaPath={ [] }
      />

      <PoweredBy />
    </form>
  );
}
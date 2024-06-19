import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Core } from './form-js-viewer-core';
import { get } from 'min-dash';

const FormContext = createContext(null);

function useField(fieldPath) {
  const form = useContext(FormContext);
  const [field, setField] = useState(get(form.schema.components, fieldPath));

  if (!form || !field) {
    throw new Error('Form not initialized');
  }

  useEffect(() => {
    const subscriber = (field) => {
      setField(field);
    };

    form.subscribe(fieldPath.toString(), subscriber);

    return () => {
      form.unsubscribe(fieldPath.toString(), subscriber);
    };
  }, [fieldPath, form]);

  return field;
}

function Form(props = {}) {
  const { context, schema } = props;

  return (
    <FormContext.Provider value={new Core({ context, schema })}>
      <Components />
    </FormContext.Provider>
  );
}

function Components(props = {}) {
  const form = useContext(FormContext);

  return (
    <>
      {form.schema.components.map((component, index) => (
        <Field fieldPath={[index]} />
      ))}
    </>
  );
}

function Field(props = {}) {
  const field = useField(props.fieldPath);

  if (field.type === 'textfield') {
    return (
      <Textfield
        value={field.value}
        onChange={(event) => {
          field.change(props.fieldPath, event.target.value);
        }}
      />
    );
  }

  if (field.type === 'checkbox') {
    return <input type="checkbox" checked={field.value} />;
  }

  return <>{field}</>;
}

function Textfield(props = {}) {
  const { value } = props;

  return <input value={value} />;
}

export { Form, useField };

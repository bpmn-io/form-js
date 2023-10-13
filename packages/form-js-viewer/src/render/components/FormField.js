import { useCallback, useContext, useEffect, useMemo } from 'preact/hooks';

import { get } from 'min-dash';

import { FormRenderContext } from '../context';

import {
  useCondition,
  useReadonly,
  useService
} from '../hooks';

import { gridColumnClasses } from './Util';

const noop = () => false;


export default function FormField(props) {
  const {
    field,
    onChange
  } = props;

  const formFields = useService('formFields'),
        viewerCommands = useService('viewerCommands', false),
        pathRegistry = useService('pathRegistry'),
        eventBus = useService('eventBus'),
        form = useService('form');

  const {
    initialData,
    data,
    errors,
    properties
  } = form._getState();

  const {
    Element,
    Empty,
    Column
  } = useContext(FormRenderContext);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const valuePath = useMemo(() => pathRegistry.getValuePath(field), [ field, pathRegistry ]);

  const initialValue = useMemo(() => get(initialData, valuePath), [ initialData, valuePath ]);

  const readonly = useReadonly(field, properties);

  const value = get(data, valuePath);

  // add precedence: global readonly > form field disabled
  const disabled = !properties.readOnly && (
    properties.disabled || field.disabled || false
  );

  const onBlur = useCallback(() => {
    if (viewerCommands) {
      viewerCommands.updateFieldValidation(field, value);
    }
    eventBus.fire('formField.blur', { formField: field });
  }, [ eventBus, viewerCommands, field, value ]);

  const onFocus = useCallback(() => {
    eventBus.fire('formField.focus', { formField: field });
  }, [ eventBus, field ]);

  useEffect(() => {
    if (viewerCommands && initialValue) {
      viewerCommands.updateFieldValidation(field, initialValue);
    }
  }, [ viewerCommands, field, initialValue ]);

  const hidden = useCondition(field.conditional && field.conditional.hide || null);

  if (hidden) {
    return <Empty />;
  }

  return (
    <Column field={ field } class={ gridColumnClasses(field) }>
      <Element class="fjs-element" field={ field }>
        <FormFieldComponent
          { ...props }
          disabled={ disabled }
          errors={ errors[ field.id ] }
          onChange={ disabled || readonly ? noop : onChange }
          onBlur={ disabled || readonly ? noop : onBlur }
          onFocus={ disabled || readonly ? noop : onFocus }
          readonly={ readonly }
          value={ value } />
      </Element>
    </Column>
  );
}

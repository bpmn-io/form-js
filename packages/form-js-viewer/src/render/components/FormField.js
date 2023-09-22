import { useCallback, useContext, useEffect, useMemo } from 'preact/hooks';

import { get } from 'min-dash';

import { FormContext, FormRenderContext } from '../context';

import {
  useCondition,
  useReadonly,
  useService
} from '../hooks';

import { gridColumnClasses, prefixId } from './Util';

const noop = () => false;


export default function FormField(props) {
  const {
    field,
    indexes,
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
    Hidden,
    Column
  } = useContext(FormRenderContext);

  const { formId } = useContext(FormContext);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const valuePath = useMemo(() => pathRegistry.getValuePath(field, { indexes }), [ field, indexes, pathRegistry ]);

  const initialValue = useMemo(() => get(initialData, valuePath), [ initialData, valuePath ]);

  const readonly = useReadonly(field, properties);

  const value = get(data, valuePath);

  // add precedence: global readonly > form field disabled
  const disabled = !properties.readOnly && (
    properties.disabled || field.disabled || false
  );

  const onBlur = useCallback(() => {
    if (viewerCommands) {
      viewerCommands.updateFieldValidation(field, value, indexes);
    }
    eventBus.fire('formField.blur', { formField: field });
  }, [ eventBus, viewerCommands, field, value, indexes ]);

  const onFocus = useCallback(() => {
    eventBus.fire('formField.focus', { formField: field });
  }, [ eventBus, field ]);

  useEffect(() => {
    if (viewerCommands && initialValue) {
      viewerCommands.updateFieldValidation(field, initialValue, indexes);
    }
  }, [ viewerCommands, field, initialValue, JSON.stringify(indexes) ]);

  const hidden = useCondition(field.conditional && field.conditional.hide || null);

  const onChangeIndexed = useCallback((update) => {

    // add indexes of the keyed field to the update, if any
    onChange(FormFieldComponent.config.keyed ? { ...update, indexes } : update);
  }, [ onChange, FormFieldComponent.config.keyed, indexes ]);

  if (hidden) {
    return <Hidden field={ field } />;
  }

  const fieldErrors = get(errors, [ field.id, ...Object.values(indexes || {}) ]) || [];
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(field.id, formId)}-error-message`;

  return (
    <Column field={ field } class={ gridColumnClasses(field) }>
      <Element class="fjs-element" field={ field }>
        <FormFieldComponent
          { ...props }
          disabled={ disabled }
          errors={ fieldErrors }
          errorMessageId={ errorMessageId }
          onChange={ disabled || readonly ? noop : onChangeIndexed }
          onBlur={ disabled || readonly ? noop : onBlur }
          onFocus={ disabled || readonly ? noop : onFocus }
          readonly={ readonly }
          value={ value } />
      </Element>
    </Column>
  );
}

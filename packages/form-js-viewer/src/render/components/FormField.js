import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import isEqual from 'lodash/isEqual';

import { get } from 'min-dash';

import { FormContext, FormRenderContext } from '../context';

import {
  useCondition,
  useReadonly,
  useService
} from '../hooks';

import { gridColumnClasses, prefixId } from './Util';

const noop = () => false;


export function FormField(props) {
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

  // track whether we should trigger initial validation on certain actions, e.g. field blur
  // disabled straight away, if viewerCommands are not available
  const [ initialValidationTrigger, setInitialValidationTrigger ] = useState(!!viewerCommands);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const fieldConfig = FormFieldComponent.config;

  const valuePath = useMemo(() => pathRegistry.getValuePath(field, { indexes }), [ field, indexes, pathRegistry ]);

  const initialValue = useMemo(() => get(initialData, valuePath), [ initialData, valuePath ]);

  const readonly = useReadonly(field, properties);

  const value = get(data, valuePath);

  // add precedence: global readonly > form field disabled
  const disabled = !properties.readOnly && (
    properties.disabled || field.disabled || false
  );

  // ensures the initial validation behavior can be re-triggered upon form reset
  useEffect(() => {

    if (!viewerCommands) {
      return;
    }

    const resetValidation = () => {
      setInitialValidationTrigger(true);
    };

    eventBus.on('import.done', resetValidation);
    eventBus.on('reset', resetValidation);

    return () => {
      eventBus.off('import.done', resetValidation);
      eventBus.off('reset', resetValidation);
    };

  }, [ eventBus, viewerCommands ]);

  useEffect(() => {

    const hasInitialValue = initialValue && !isEqual(initialValue, []);

    if (initialValidationTrigger && hasInitialValue) {
      setInitialValidationTrigger(false);
      viewerCommands.updateFieldValidation(field, initialValue, indexes);
    }

  }, [ viewerCommands, field, initialValue, initialValidationTrigger, indexes ]);

  const onBlur = useCallback(() => {

    const value = get(data, valuePath);

    if (initialValidationTrigger) {
      setInitialValidationTrigger(false);
      viewerCommands.updateFieldValidation(field, value, indexes);
    }

    eventBus.fire('formField.blur', { formField: field });

  }, [ eventBus, field, indexes, viewerCommands, initialValidationTrigger, data, valuePath ]);

  const onFocus = useCallback(() => {
    eventBus.fire('formField.focus', { formField: field });
  }, [ eventBus, field ]);

  const hidden = useCondition(field.conditional && field.conditional.hide || null);

  const onChangeIndexed = useCallback((update) => {

    // any data change will trigger validation
    setInitialValidationTrigger(false);

    // add indexes of the keyed field to the update, if any
    onChange(fieldConfig.keyed ? { ...update, indexes } : update);
  }, [ onChange, fieldConfig.keyed, indexes ]);

  if (hidden) {
    return <Hidden field={ field } />;
  }

  const domId = `${prefixId(field.id, formId, indexes)}`;
  const fieldErrors = get(errors, [ field.id, ...Object.values(indexes || {}) ]) || [];

  const formFieldElement = (
    <FormFieldComponent
      { ...props }
      disabled={ disabled }
      errors={ fieldErrors }
      domId={ domId }
      onChange={ disabled || readonly ? noop : onChangeIndexed }
      onBlur={ disabled || readonly ? noop : onBlur }
      onFocus={ disabled || readonly ? noop : onFocus }
      readonly={ readonly }
      value={ value }
    />
  );

  if (fieldConfig.escapeGridRender) {
    return formFieldElement;
  }

  return (
    <Column field={ field } class={ gridColumnClasses(field) }>
      <Element class="fjs-element" field={ field }>
        { formFieldElement }
      </Element>
    </Column>
  );
}

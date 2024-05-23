import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import isEqual from 'lodash/isEqual';

import { get } from 'min-dash';

import { FormContext, FormRenderContext, ExpressionContextInfo } from '../context';

import { useCondition, useReadonly, useService } from '../hooks';

import { gridColumnClasses, prefixId } from './Util';

const noop = () => false;

export function FormField(props) {
  const { field, indexes, onChange: _onChange } = props;

  const formFields = useService('formFields'),
    viewerCommands = useService('viewerCommands', false),
    formFieldInstanceRegistry = useService('formFieldInstanceRegistry', false),
    pathRegistry = useService('pathRegistry'),
    eventBus = useService('eventBus'),
    form = useService('form');

  const { initialData, data, errors, properties } = form._getState();

  const { Element, Hidden, Column } = useContext(FormRenderContext);

  const { formId } = useContext(FormContext);

  const [validationGrace, setValidationGrace] = useState(!!viewerCommands);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const fieldConfig = FormFieldComponent.config;

  const expressionContextInfo = useContext(ExpressionContextInfo);
  const valuePath = useMemo(() => pathRegistry.getValuePath(field, { indexes }), [field, indexes, pathRegistry]);

  const initialValue = useMemo(() => get(initialData, valuePath), [initialData, valuePath]);

  const readonly = useReadonly(field, properties);

  const value = get(data, valuePath);

  // add precedence: global readonly > form field disabled
  const disabled = !properties.readOnly && (properties.disabled || field.disabled || false);

  const hidden = useCondition((field.conditional && field.conditional.hide) || null);

  const fieldInstance = useMemo(
    () => ({
      id: field.id,
      expressionContextInfo,
      valuePath,
      indexes,
    }),
    [field.id, valuePath, expressionContextInfo, indexes],
  );

  // register form field instance
  useEffect(() => {
    if (formFieldInstanceRegistry && !hidden) {
      const instanceId = formFieldInstanceRegistry.add(fieldInstance);

      return () => {
        formFieldInstanceRegistry.remove(instanceId);
      };
    }
  }, [fieldInstance, formFieldInstanceRegistry, hidden]);

  // ensures the initial validation behavior can be re-triggered upon form reset
  useEffect(() => {
    if (!viewerCommands) {
      return;
    }

    const resetValidationGrace = () => {
      setValidationGrace(true);
    };

    eventBus.on('import.done', resetValidationGrace);
    eventBus.on('reset', resetValidationGrace);

    return () => {
      eventBus.off('import.done', resetValidationGrace);
      eventBus.off('reset', resetValidationGrace);
    };
  }, [eventBus, viewerCommands]);

  useEffect(() => {
    const hasInitialValue = initialValue && !isEqual(initialValue, []);

    if (validationGrace && hasInitialValue) {
      setValidationGrace(false);
      viewerCommands.updateFieldInstanceValidation(fieldInstance, initialValue);
    }
  }, [fieldInstance, validationGrace, initialValue, viewerCommands]);

  const onBlur = useCallback(() => {
    const value = get(data, valuePath);
    if (validationGrace) {
      setValidationGrace(false);
      viewerCommands.updateFieldInstanceValidation(fieldInstance, value);
    }
    eventBus.fire('formField.blur', { formField: field });
  }, [data, eventBus, field, fieldInstance, validationGrace, valuePath, viewerCommands]);

  const onFocus = useCallback(() => {
    eventBus.fire('formField.focus', { formField: field });
  }, [eventBus, field]);

  const onChange = useCallback(
    (update) => {
      setValidationGrace(false);
      _onChange({ field, indexes, fieldInstance, ...update });
    },
    [_onChange, field, fieldInstance, indexes],
  );

  const fieldErrors = useMemo(() => {
    if (validationGrace) {
      return [];
    }

    return get(errors, [field.id, ...Object.values(indexes || {})]) || [];
  }, [errors, field.id, indexes, validationGrace]);

  if (hidden) {
    return <Hidden field={field} />;
  }

  const domId = `${prefixId(field.id, formId, indexes)}`;

  const formFieldElement = (
    <FormFieldComponent
      {...props}
      disabled={disabled}
      errors={fieldErrors}
      domId={domId}
      onChange={disabled || readonly ? noop : onChange}
      onBlur={disabled || readonly ? noop : onBlur}
      onFocus={disabled || readonly ? noop : onFocus}
      readonly={readonly}
      value={value}
      fieldInstance={fieldInstance}
    />
  );

  if (fieldConfig.escapeGridRender) {
    return formFieldElement;
  }

  return (
    <Column field={field} class={gridColumnClasses(field)}>
      <Element class="fjs-element" field={field}>
        {formFieldElement}
      </Element>
    </Column>
  );
}

import Ids from 'ids';

import { useRef, useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import isEqual from 'lodash/isEqual';

import { get } from 'min-dash';

import { FormContext, FormRenderContext, LocalExpressionContext } from '../context';

import { useCondition, useReadonly, useService } from '../hooks';

import { gridColumnClasses, prefixId } from './Util';

const noop = () => false;
const ids = new Ids([32, 36, 1]);

export function FormField(props) {
  const instanceIdRef = useRef(ids.next());

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

  // track whether we should trigger initial validation on certain actions, e.g. field blur
  // disabled straight away, if viewerCommands are not available
  const [initialValidationTrigger, setInitialValidationTrigger] = useState(!!viewerCommands);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const fieldConfig = FormFieldComponent.config;

  const localExpressionContext = useContext(LocalExpressionContext);
  const valuePath = useMemo(() => pathRegistry.getValuePath(field, { indexes }), [field, indexes, pathRegistry]);

  const initialValue = useMemo(() => get(initialData, valuePath), [initialData, valuePath]);

  const readonly = useReadonly(field, properties);

  const value = get(data, valuePath);

  // add precedence: global readonly > form field disabled
  const disabled = !properties.readOnly && (properties.disabled || field.disabled || false);

  const hidden = useCondition((field.conditional && field.conditional.hide) || null);

  const instanceId = useMemo(() => {
    if (!formFieldInstanceRegistry) {
      return null;
    }

    return formFieldInstanceRegistry.syncInstance(instanceIdRef.current, {
      id: field.id,
      expressionContextInfo: localExpressionContext,
      valuePath,
      value,
      indexes,
      hidden,
    });
  }, [formFieldInstanceRegistry, field.id, localExpressionContext, valuePath, value, indexes, hidden]);

  const fieldInstance = instanceId ? formFieldInstanceRegistry.get(instanceId) : null;

  // cleanup the instance on unmount
  useEffect(() => {
    const instanceId = instanceIdRef.current;

    if (formFieldInstanceRegistry) {
      return () => formFieldInstanceRegistry.cleanupInstance(instanceId);
    }
  }, [formFieldInstanceRegistry]);

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
  }, [eventBus, viewerCommands]);

  useEffect(() => {
    const hasInitialValue = initialValue && !isEqual(initialValue, []);

    if (initialValidationTrigger && hasInitialValue && fieldInstance) {
      setInitialValidationTrigger(false);
      viewerCommands.updateFieldInstanceValidation(fieldInstance, initialValue);
    }
  }, [fieldInstance, initialValidationTrigger, initialValue, viewerCommands]);

  const onBlur = useCallback(() => {
    const value = get(data, valuePath);

    if (initialValidationTrigger) {
      setInitialValidationTrigger(false);
      viewerCommands.updateFieldInstanceValidation(fieldInstance, value);
    }

    eventBus.fire('formField.blur', { formField: field });
  }, [data, eventBus, field, fieldInstance, initialValidationTrigger, valuePath, viewerCommands]);

  const onFocus = useCallback(() => {
    eventBus.fire('formField.focus', { formField: field });
  }, [eventBus, field]);

  const onChange = useCallback(
    (update) => {
      setInitialValidationTrigger(false);
      _onChange({ field, indexes, fieldInstance, ...update });
    },
    [_onChange, field, fieldInstance, indexes],
  );

  if (hidden) {
    return <Hidden field={field} />;
  }

  const domId = `${prefixId(field.id, formId, indexes)}`;
  const fieldErrors = get(errors, [field.id, ...Object.values(indexes || {})]) || [];

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

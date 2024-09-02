import { clone, getSchemaVariables } from '@bpmn-io/form-js-viewer';
import { useService } from './usePropertiesPanelService';
import { useMemo, useState } from 'preact/hooks';

/**
 * Retrieve list of variables from the form schema in the structure expected by FEEL entries.
 *
 * @returns { { name: string; }[] } list of variables used in form schema
 */
export function useVariables() {
  const form = useService('formEditor');
  const [schema, setSchema] = useState(clone(form.getSchema()));

  form.on('changed', ({ schema }) => {
    if (schema !== undefined) {
      setSchema(clone(schema));
    }
  });

  return useMemo(() => getSchemaVariables(schema).map((name) => ({ name, type: 'variable' })), [schema]);
}

import { getSchemaVariables } from '@bpmn-io/form-js-viewer';
import { useService } from '../../../render/hooks';

/**
 * Retrieve list of variables from the form schema.
 *
 * @returns { string[] } list of variables used in form schema
 */
export function useVariables() {
  const form = useService('formEditor');
  const schema = form.getSchema();

  return getSchemaVariables(schema);
}

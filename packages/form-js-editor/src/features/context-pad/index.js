import { FormFieldContextActions } from './FormFieldContextActions';
import { DeleteActionProvider } from './DeleteActionProvider';

export const ContextPadModule = {
  __init__: ['formFieldContextActions', 'deleteActionProvider'],
  formFieldContextActions: ['type', FormFieldContextActions],
  deleteActionProvider: ['type', DeleteActionProvider],
};

export { FormFieldContextActions } from './FormFieldContextActions';
export { DeleteActionProvider } from './DeleteActionProvider';

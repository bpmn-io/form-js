import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function PageNavigationEntries(props) {
  const { editField, field } = props;

  const isPage = (field) => field.type === 'page';

  return [
    {
      id: 'backLabel',
      component: BackLabel,
      editField,
      field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: isPage,
    },
    {
      id: 'nextLabel',
      component: NextLabel,
      editField,
      field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: isPage,
    },
    {
      id: 'submitLabel',
      component: SubmitLabel,
      editField,
      field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: isPage,
    },
  ];
}

function BackLabel(props) {
  return NavigationLabel({
    ...props,
    path: ['backLabel'],
    label: 'Back button label',
    tooltip: 'Shown on the control that returns to the previous page. Defaults to "Back".',
  });
}

function NextLabel(props) {
  return NavigationLabel({
    ...props,
    path: ['nextLabel'],
    label: 'Next button label',
    tooltip: 'Shown on the control that continues to the following page. Defaults to "Next".',
  });
}

function SubmitLabel(props) {
  return NavigationLabel({
    ...props,
    path: ['submitLabel'],
    label: 'Submit button label',
    tooltip: 'Shown on the control that submits the form while this page is the last one. Defaults to "Submit".',
  });
}

function NavigationLabel(props) {
  const { editField, field, id, label, path, tooltip } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label,
    setValue,
    singleLine: true,
    tooltip,
    variables,
  });
}

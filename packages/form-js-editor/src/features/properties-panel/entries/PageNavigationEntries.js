import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function PageNavigationEntries(props) {
  const { editField, field } = props;

  // a container sets the labels for all of its pages, which a page may override
  const isPage = (field) => field.type === 'page' || field.type === 'multipage';

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
  const { field } = props;

  const translate = useService('translate');

  return NavigationLabel({
    ...props,
    path: ['backLabel'],
    label: translate('Back button label'),
    tooltip: isMultiPage(field)
      ? translate('Default for the pages of this container. A page can override it. Defaults to "Back".')
      : translate('Shown on the control that returns to the previous page. Defaults to "Back".'),
  });
}

function NextLabel(props) {
  const { field } = props;

  const translate = useService('translate');

  return NavigationLabel({
    ...props,
    path: ['nextLabel'],
    label: translate('Next button label'),
    tooltip: isMultiPage(field)
      ? translate('Default for the pages of this container. A page can override it. Defaults to "Next".')
      : translate('Shown on the control that continues to the following page. Defaults to "Next".'),
  });
}

function SubmitLabel(props) {
  const { field } = props;

  const translate = useService('translate');

  return NavigationLabel({
    ...props,
    path: ['submitLabel'],
    label: translate('Submit button label'),
    tooltip: isMultiPage(field)
      ? translate('Default for the pages of this container. A page can override it. Defaults to "Submit".')
      : translate('Shown on the control that submits the form while this page is the last one. Defaults to "Submit".'),
  });
}

function isMultiPage(field) {
  return field.type === 'multipage';
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

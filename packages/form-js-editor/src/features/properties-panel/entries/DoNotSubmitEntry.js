import { simpleBoolEntryFactory } from './factories';

export function DoNotSubmitEntry(props) {
  const {
    field,
    getService
  } = props;

  const formFields = getService('formFields');

  const fieldDescriptors = {
    script: "function's",
    expression: "expression's",
  };

  const entries = [
    simpleBoolEntryFactory({
      id: 'doNotSubmit',
      label: `Do not submit the ${fieldDescriptors[field.type] || "field's"} result with the form submission`,
      tooltip: 'Prevents the data associated with this form element from being submitted by the form. Use for intermediate calculations.',
      path: [ 'doNotSubmit' ],
      props,
      isDefaultVisible: (field) => {
        const { config } = formFields.get(field.type);
        return config.keyed && config.allowDoNotSubmit;
      }
    })
  ];

  return entries;
}
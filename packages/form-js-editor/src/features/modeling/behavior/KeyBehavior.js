import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class KeyBehavior extends CommandInterceptor {
  constructor(eventBus, modeling, formFields) {
    super(eventBus);

    // @ts-ignore-next-line
    this.preExecute('formField.remove', function(context) {

      const { formField } = context;
      const { key, type } = formField;
      const { config } = formFields.get(type);

      if (config.keyed && key) {
        modeling.unclaimKey(formField, key);
      }
    }, true);

    // @ts-ignore-next-line
    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      const { key: oldKey, type } = formField;
      const { key: newKey } = properties;
      const { config } = formFields.get(type);

      if (config.keyed && newKey) {
        modeling.unclaimKey(formField, oldKey);
        modeling.claimKey(formField, newKey);
      }
    }, true);
  }
}

KeyBehavior.$inject = [ 'eventBus', 'modeling', 'formFields' ];
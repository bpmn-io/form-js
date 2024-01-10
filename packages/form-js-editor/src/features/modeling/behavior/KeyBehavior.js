import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export class KeyBehavior extends CommandInterceptor {
  constructor(eventBus, modeling, formFields) {
    super(eventBus);

    this.preExecute('formField.remove', function(context) {

      const { formField } = context;
      const { key, type } = formField;
      const { config } = formFields.get(type);

      if (config.keyed) {
        modeling.unclaimKey(formField, key);
      }
    }, true);

    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      const { key, type } = formField;
      const { config } = formFields.get(type);

      if (config.keyed && 'key' in properties) {
        modeling.unclaimKey(formField, key);
        modeling.claimKey(formField, properties.key);
      }
    }, true);
  }
}

KeyBehavior.$inject = [ 'eventBus', 'modeling', 'formFields' ];
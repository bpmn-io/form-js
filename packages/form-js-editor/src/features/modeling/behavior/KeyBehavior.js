import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class KeyBehavior extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    // @ts-ignore-next-line
    this.preExecute('formField.remove', function(context) {
      const { formField } = context;

      const { key } = formField;

      if (key) {
        modeling.unclaimKey(formField, key);
      }
    }, true);

    // @ts-ignore-next-line
    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      if ('key' in properties) {
        modeling.unclaimKey(formField, formField.key);

        modeling.claimKey(formField, properties.key);
      }
    }, true);
  }
}

KeyBehavior.$inject = [ 'eventBus', 'modeling' ];
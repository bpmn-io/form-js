import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export class IdBehavior extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    this.preExecute('formField.remove', function(context) {
      const { formField } = context;

      const { id } = formField;

      modeling.unclaimId(formField, id);
    }, true);

    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      if ('id' in properties) {
        modeling.unclaimId(formField, formField.id);

        modeling.claimId(formField, properties.id);
      }
    }, true);
  }
}

IdBehavior.$inject = [ 'eventBus', 'modeling' ];
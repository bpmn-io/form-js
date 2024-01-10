import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export class PathBehavior extends CommandInterceptor {
  constructor(eventBus, modeling, formFields) {
    super(eventBus);

    this.preExecute('formField.remove', function(context) {
      const { formField } = context;
      const { path, type } = formField;
      const { config } = formFields.get(type);

      if (config.pathed) {
        modeling.unclaimPath(formField, path);
      }
    }, true);

    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      const { path, type } = formField;
      const { config } = formFields.get(type);

      if (config.pathed && 'path' in properties) {
        modeling.unclaimPath(formField, path);
        modeling.claimPath(formField, properties.path);
      }
    }, true);
  }
}

PathBehavior.$inject = [ 'eventBus', 'modeling', 'formFields' ];
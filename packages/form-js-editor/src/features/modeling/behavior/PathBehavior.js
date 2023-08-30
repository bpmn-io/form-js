import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class PathBehavior extends CommandInterceptor {
  constructor(eventBus, modeling, formFields) {
    super(eventBus);

    // @ts-ignore-next-line
    this.preExecute('formField.remove', function(context) {
      const { formField } = context;
      const { path, type } = formField;
      const { config } = formFields.get(type);

      if (config.routed) {
        modeling.unclaimPath(formField, path);
      }
    }, true);

    // @ts-ignore-next-line
    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      const { path, type } = formField;
      const { config } = formFields.get(type);

      if (config.routed && 'path' in properties) {
        modeling.unclaimPath(formField, path);
        modeling.claimPath(formField, properties.path);
      }
    }, true);
  }
}

PathBehavior.$inject = [ 'eventBus', 'modeling', 'formFields' ];
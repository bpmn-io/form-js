import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class PathBehavior extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    // @ts-ignore-next-line
    this.preExecute('formField.remove', function(context) {
      const { formField } = context;

      const { path } = formField;

      if (path) {
        modeling.unclaimPath(formField, path);
      }
    }, true);

    // @ts-ignore-next-line
    this.preExecute('formField.edit', function(context) {
      const {
        formField,
        properties
      } = context;

      if ('path' in properties) {
        modeling.unclaimPath(formField, formField.path);
        modeling.claimPath(formField, properties.path);
      }
    }, true);
  }
}

PathBehavior.$inject = [ 'eventBus', 'modeling' ];
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export class ValidateBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    /**
     * Remove custom validation if <validationType> is about to be added.
     */
    this.preExecute('formField.edit', function(context) {
      const { properties } = context;

      const { validate = {} } = properties;

      if (validate.validationType) {
        const newValidate = {
          ...validate
        };

        delete newValidate.minLength;
        delete newValidate.maxLength;
        delete newValidate.pattern;

        properties['validate'] = newValidate;
      }
    }, true);
  }
}

ValidateBehavior.$inject = [ 'eventBus' ];
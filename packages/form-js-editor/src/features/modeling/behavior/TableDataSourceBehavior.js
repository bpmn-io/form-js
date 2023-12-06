import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { get } from 'min-dash';

export class TableDataSourceBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    this.preExecute('formField.add', function(context) {

      const { formField } = context;

      if (get(formField, [ 'type' ]) !== 'table') {
        return;
      }

      context.formField = {
        ...formField,
        dataSource: `=${formField.id}`
      };
    }, true);
  }
}

TableDataSourceBehavior.$inject = [ 'eventBus' ];
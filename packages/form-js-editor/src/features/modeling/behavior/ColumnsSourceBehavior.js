import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { get, isArray, isDefined, isString } from 'min-dash';

const COLUMNS_SOURCE_PROPERTIES = {
  columns: 'columns',
  columnsExpression: 'columnsExpression'
};

export class ColumnsSourceBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    this.preExecute('formField.edit', function(context) {
      const { properties, oldProperties } = context;

      const isColumnSourceUpdate = Object.values(COLUMNS_SOURCE_PROPERTIES).some(path => {
        return get(properties, [ path ]) !== undefined;
      });

      if (!isColumnSourceUpdate) {
        return;
      }

      const columns = get(properties, [ COLUMNS_SOURCE_PROPERTIES.columns ]);
      const oldColumns = get(oldProperties, [ COLUMNS_SOURCE_PROPERTIES.columns ]);
      const columnsExpression = get(properties, [ COLUMNS_SOURCE_PROPERTIES.columnsExpression ]);
      const oldColumnsExpression = get(oldProperties, [ COLUMNS_SOURCE_PROPERTIES.columnsExpression ]);

      if (isArray(columns) && !isDefined(oldColumns)) {
        context.properties = {
          ...properties,
          columnsExpression: undefined
        };
        return;
      }

      if (isString(columnsExpression) && !isString(oldColumnsExpression)) {
        context.properties = {
          ...properties,
          columns: undefined
        };
        return;
      }

    }, true);
  }
}

ColumnsSourceBehavior.$inject = [ 'eventBus' ];


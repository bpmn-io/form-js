import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { get } from 'min-dash';

import {
  VALUES_SOURCES,
  VALUES_SOURCES_PATHS
} from '@bpmn-io/form-js-viewer';

export default class ValuesSourceBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    /**
     * Cleanup properties on changing the values source.
     *
     * 1) Remove other sources, e.g. set `values` => remove `valuesKey` and `valuesExpression`
     * 2) Remove default values for all other values sources
     */
    this.preExecute('formField.edit', function(context) {
      const { properties } = context;

      const newProperties = {};

      if (!isValuesSourceUpdate(properties)) {
        return;
      }

      // clean up value sources that are not to going to be set
      Object.values(VALUES_SOURCES).forEach(source => {
        const path = VALUES_SOURCES_PATHS[source];
        if (get(properties, path) == undefined) {
          newProperties[VALUES_SOURCES_PATHS[source]] = undefined;
        }
      });

      // clean up default value
      if (
        get(properties, VALUES_SOURCES_PATHS[VALUES_SOURCES.EXPRESSION]) !== undefined ||
        get(properties, VALUES_SOURCES_PATHS[VALUES_SOURCES.INPUT]) !== undefined
      ) {
        newProperties['defaultValue'] = undefined;
      }

      context.properties = {
        ...properties,
        ...newProperties
      };
    }, true);
  }
}

ValuesSourceBehavior.$inject = [ 'eventBus' ];

// helper ///////////////////

function isValuesSourceUpdate(properties) {
  return Object.values(VALUES_SOURCES_PATHS).some(path => {
    return get(properties, path) !== undefined;
  });
}
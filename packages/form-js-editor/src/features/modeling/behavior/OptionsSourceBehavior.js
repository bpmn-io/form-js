import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { get } from 'min-dash';

import {
  OPTIONS_SOURCES,
  OPTIONS_SOURCES_PATHS
} from '@bpmn-io/form-js-viewer';

export class OptionsSourceBehavior extends CommandInterceptor {
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
      Object.values(OPTIONS_SOURCES).forEach(source => {
        const path = OPTIONS_SOURCES_PATHS[source];
        if (get(properties, path) == undefined) {
          newProperties[OPTIONS_SOURCES_PATHS[source]] = undefined;
        }
      });

      // clean up default value
      if (
        get(properties, OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.EXPRESSION]) !== undefined ||
        get(properties, OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.INPUT]) !== undefined
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

OptionsSourceBehavior.$inject = [ 'eventBus' ];

// helper ///////////////////

function isValuesSourceUpdate(properties) {
  return Object.values(OPTIONS_SOURCES_PATHS).some(path => {
    return get(properties, path) !== undefined;
  });
}
import { get } from 'min-dash';

// config  ///////////////////

export const VALUES_SOURCES = {
  STATIC: 'static',
  INPUT: 'input',
  EXPRESSION: 'expression',
};

export const VALUES_SOURCE_DEFAULT = VALUES_SOURCES.STATIC;

export const VALUES_SOURCES_LABELS = {
  [VALUES_SOURCES.STATIC]: 'Static',
  [VALUES_SOURCES.INPUT]: 'Input data',
  [VALUES_SOURCES.EXPRESSION]: 'Expression',
};

export const VALUES_SOURCES_PATHS = {
  [VALUES_SOURCES.STATIC]: [ 'values' ],
  [VALUES_SOURCES.INPUT]: [ 'valuesKey' ],
  [VALUES_SOURCES.EXPRESSION]: [ 'valuesExpression' ],
};

export const VALUES_SOURCES_DEFAULTS = {
  [VALUES_SOURCES.STATIC]: [
    {
      label: 'Value',
      value: 'value'
    }
  ],
  [VALUES_SOURCES.INPUT]: '',
  [VALUES_SOURCES.EXPRESSION]: '='
};

// helpers ///////////////////

export function getValuesSource(field) {

  for (const source of Object.values(VALUES_SOURCES)) {
    if (get(field, VALUES_SOURCES_PATHS[source]) !== undefined) {
      return source;
    }
  }

  return VALUES_SOURCE_DEFAULT;
}

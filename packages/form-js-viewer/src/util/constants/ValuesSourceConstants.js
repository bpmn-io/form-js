import { get } from 'min-dash';

// config  ///////////////////

export const VALUES_SOURCES = {
  STATIC: 'static',
  INPUT: 'input'
};

export const VALUES_SOURCE_DEFAULT = VALUES_SOURCES.STATIC;

export const VALUES_SOURCES_LABELS = {
  [VALUES_SOURCES.STATIC]: 'Static',
  [VALUES_SOURCES.INPUT]: 'Input data',
};

export const VALUES_SOURCES_PATHS = {
  [VALUES_SOURCES.STATIC]: [ 'values' ],
  [VALUES_SOURCES.INPUT]: [ 'valuesKey' ],
};

export const VALUES_SOURCES_DEFAULTS = {
  [VALUES_SOURCES.STATIC]: [
    {
      label: 'Value',
      value: 'value'
    }
  ],
  [VALUES_SOURCES.INPUT]: '',
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

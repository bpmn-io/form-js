import { get } from 'min-dash';

// config  ///////////////////

export const OPTIONS_SOURCES = {
  STATIC: 'static',
  INPUT: 'input',
  EXPRESSION: 'expression',
};

export const OPTIONS_SOURCE_DEFAULT = OPTIONS_SOURCES.STATIC;

export const OPTIONS_SOURCES_LABELS = (translate) =>  {
  return{
    [OPTIONS_SOURCES.STATIC]: translate('Static'),
    [OPTIONS_SOURCES.INPUT]: translate('Input data'),
    [OPTIONS_SOURCES.EXPRESSION]: translate('Expression'),
  }
};

export const OPTIONS_SOURCES_PATHS = {
  [OPTIONS_SOURCES.STATIC]: ['values'],
  [OPTIONS_SOURCES.INPUT]: ['valuesKey'],
  [OPTIONS_SOURCES.EXPRESSION]: ['valuesExpression'],
};

export const OPTIONS_SOURCES_DEFAULTS = {
  [OPTIONS_SOURCES.STATIC]: [
    {
      label: 'Value',
      value: 'value',
    },
  ],
  [OPTIONS_SOURCES.INPUT]: '',
  [OPTIONS_SOURCES.EXPRESSION]: '=',
};

// helpers ///////////////////

export function getOptionsSource(field) {
  for (const source of Object.values(OPTIONS_SOURCES)) {
    if (get(field, OPTIONS_SOURCES_PATHS[source]) !== undefined) {
      return source;
    }
  }

  return OPTIONS_SOURCE_DEFAULT;
}

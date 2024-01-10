import { useEffect, useState } from 'preact/hooks';
import { normalizeOptionsData } from '../components/util/optionsUtil';
import { useExpressionEvaluation } from './useExpressionEvaluation';
import { useDeepCompareState } from './useDeepCompareState';
import { useService } from './useService';

/**
 * @enum { String }
 */
export const LOAD_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

/**
 * @typedef {Object} OptionsGetter
 * @property {Object[]} options - The options data
 * @property {(LOAD_STATES)} loadState - The options data's loading state, to use for conditional rendering
 */

/**
 * A hook to load options for single and multiselect components.
 *
 * @param {Object} field - The form field to handle options for
 * @return {OptionsGetter} optionsGetter - A options getter object providing loading state and options
 */
export function useOptionsAsync(field) {
  const {
    valuesExpression: optionsExpression,
    valuesKey: optionsKey,
    values: staticOptions
  } = field;

  const [ optionsGetter, setOptionsGetter ] = useState({ options: [], error: undefined, loadState: LOAD_STATES.LOADING });
  const initialData = useService('form')._getState().initialData;

  const expressionEvaluation = useExpressionEvaluation(optionsExpression);
  const evaluatedOptions = useDeepCompareState(expressionEvaluation || [], []);

  useEffect(() => {

    let options = [];

    // dynamic options
    if (optionsKey !== undefined) {
      const keyedOptions = (initialData || {})[ optionsKey ];

      if (keyedOptions && Array.isArray(keyedOptions)) {
        options = keyedOptions;
      }

    // static options
    } else if (staticOptions !== undefined) {
      options = Array.isArray(staticOptions) ? staticOptions : [];

    // expression
    } else if (optionsExpression) {

      if (evaluatedOptions && Array.isArray(evaluatedOptions)) {
        options = evaluatedOptions;
      }
    } else {
      setOptionsGetter(buildErrorState('No options source defined in the form definition'));
      return;
    }

    // normalize data to support primitives and partially defined objects
    options = normalizeOptionsData(options);

    setOptionsGetter(buildLoadedState(options));

  }, [ optionsKey, staticOptions, initialData, optionsExpression, evaluatedOptions ]);

  return optionsGetter;
}

const buildErrorState = (error) => ({ options: [], error, loadState: LOAD_STATES.ERROR });

const buildLoadedState = (options) => ({ options, error: undefined, loadState: LOAD_STATES.LOADED });

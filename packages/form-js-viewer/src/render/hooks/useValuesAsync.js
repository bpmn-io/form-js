import { useEffect, useState } from 'preact/hooks';
import { normalizeValuesData } from '../components/util/valuesUtil';
import useService from './useService';

/**
 * @enum { String }
 */
export const LOAD_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

/**
 * @typedef {Object} ValuesGetter
 * @property {Object[]} values - The values data
 * @property {(LOAD_STATES)} state - The values data's loading state, to use for conditional rendering
 */

/**
 * A hook to load values for single and multiselect components.
 *
 * @param {Object} field - The form field to handle values for
 * @return {ValuesGetter} valuesGetter - A values getter object providing loading state and values
 */
export default function(field) {
  const {
    valuesKey,
    values: staticValues
  } = field;

  const [ valuesGetter, setValuesGetter ] = useState({ values: [], error: undefined, state: LOAD_STATES.LOADING });
  const initialData = useService('form')._getState().initialData;

  useEffect(() => {

    let values = [];

    // dynamic values
    if (valuesKey !== undefined) {
      const keyedValues = (initialData || {})[ valuesKey ];

      if (keyedValues && Array.isArray(keyedValues)) {
        values = keyedValues;
      }
    }

    // static values
    else if (staticValues !== undefined) {
      values = Array.isArray(staticValues) ? staticValues : [];
    }
    else {
      setValuesGetter(buildErrorState('No values source defined in the form definition'));
      return;
    }

    // normalize data to support primitives and partially defined objects
    values = normalizeValuesData(values);

    setValuesGetter(buildLoadedState(values));

  }, [ valuesKey, staticValues, initialData ]);

  return valuesGetter;
}

const buildErrorState = (error) => ({ values: [], error, state: LOAD_STATES.ERROR });

const buildLoadedState = (values) => ({ values, error: undefined, state: LOAD_STATES.LOADED });

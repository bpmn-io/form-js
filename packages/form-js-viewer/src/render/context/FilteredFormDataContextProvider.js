import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import useService from '../hooks/useService';
import useDeepCompareState from '../hooks/useDeepCompareState';

export const FilteredFormDataContext = createContext(null);

export const FilteredFormDataProvider = ({ children }) => {
  const { initialData, data } = useService('form')._getState();

  const initialDataDeep = useDeepCompareState(initialData, {});
  const dataDeep = useDeepCompareState(data, {});

  const conditionChecker = useService('conditionChecker', false);
  const [ filteredData, setFilteredData ] = useState(data);

  useEffect(() => {
    const newData = conditionChecker ? conditionChecker.applyConditions(dataDeep, dataDeep) : dataDeep;
    setFilteredData({ ...initialDataDeep, ...newData });
  }, [ conditionChecker, dataDeep, initialDataDeep ]);

  return (
    <FilteredFormDataContext.Provider value={ filteredData }>
      {children}
    </FilteredFormDataContext.Provider>
  );
};
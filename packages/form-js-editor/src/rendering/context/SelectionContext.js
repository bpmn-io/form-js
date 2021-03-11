import { createContext } from 'preact';

const SelectionContext = createContext({
  selection: null,
  setSelection: () => {}
});

export default SelectionContext;
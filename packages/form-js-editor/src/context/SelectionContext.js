import { createContext } from 'solid-js';

const SelectionContext = createContext({
  selection: null,
  setSelection: () => {}
});

export default SelectionContext;
import { createContext } from 'preact';

const SelectionContext = createContext({
  selection: null,

  /**
   * @param {string|null} id
   */
  setSelection(id) {}
});

export default SelectionContext;
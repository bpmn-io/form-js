import { createContext } from 'preact';

const defaultValue = {
  addFill() {},
  removeFill() {}
};

const FillContext = createContext(defaultValue);

export default FillContext;
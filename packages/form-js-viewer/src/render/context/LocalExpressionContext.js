import { createContext } from 'preact';

const LocalExpressionContext = createContext({
  this: null,
  parent: null,
  i: null
});

export default LocalExpressionContext;
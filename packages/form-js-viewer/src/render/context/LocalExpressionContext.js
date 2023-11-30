import { createContext } from 'preact';

const LocalExpressionContext = createContext({
  data: null,
  this: null,
  parent: null,
  i: null
});

export default LocalExpressionContext;
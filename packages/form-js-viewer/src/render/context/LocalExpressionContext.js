import { createContext } from 'preact';

export const LocalExpressionContext = createContext({
  data: null,
  this: null,
  parent: null,
  i: null
});

import { createContext } from 'preact';

const FillContext = createContext({
  addFill(uid, props) { throw new Error('FillContext.addFill() uninitialized'); },
  removeFill(uid) { throw new Error('FillContext.addFill() uninitialized'); }
});

export default FillContext;
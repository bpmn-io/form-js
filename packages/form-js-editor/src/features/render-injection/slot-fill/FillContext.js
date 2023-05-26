import { createContext } from 'preact';

const FillContext = createContext({
  addFill() { console.log('defaultAddFill') },
  removeFill() {}
});

export default FillContext;
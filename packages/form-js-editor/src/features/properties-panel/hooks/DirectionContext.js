import { useContext } from 'preact/hooks';
import { createContext } from 'preact';

const DirectionContext = createContext({
  direction: 'ltr',
  setDirection: (direction) => {},
});

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
}

// // hooks/useDirection.js
// import { useContext } from 'preact/hooks';
// import { FormContext } from '../context/FormContext'; // Adjust the path as necessary

// export function useDirection() {
//   const form = useContext(FormContext);
//   const { schema } = form._getState();
//   const direction = schema?.direction || 'ltr';
//   return direction;
// }

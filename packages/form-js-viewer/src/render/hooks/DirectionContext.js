// import { createContext } from 'preact';
// import { useContext } from 'preact/hooks';

// export const DirectionContext = createContext({
//   direction: 'ltr',
//   setDirection: (direction) => {},
// });

// export function useDirection() {
//   return useContext(DirectionContext);
// }

// context/DirectionContext.js

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

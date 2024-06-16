import { createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

export const DirectionContext = createContext({
  direction: 'ltr',
  setDirection: (direction) => {}
});

export function DirectionProvider({ children }) {
  const [direction, setDirection] = useState('ltr');

  console.log('DirectionProvider render:', direction);

  return (
    <DirectionContext.Provider value={{ direction, setDirection }}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  return useContext(DirectionContext);
}

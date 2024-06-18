import { createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

export const DirectionContext = createContext({
  direction: 'ltr',
  setDirection: (direction) => {},
});

export function useDirection() {
  return useContext(DirectionContext);
}

import FillContext from './FillContext';
import SlotContext from './SlotContext';
import { useRef, useState } from 'preact/hooks';

export default ({ children }) => {
  const [ fills, setFills ] = useState([]);
  
  const uid = useRef(7913);
  const fillContext = useRef({
    addFill: (newFill) => {
      let id = newFill.id;

      if (!id) {
        id = newFill.id = uid.current++;
      }

      setFills((fills) => {
        const newFills = fills.map(function(fill) {
          if (fill.id === id) {
            return newFill;
          }

          return fill;
        });

        if (newFills.length === fills.length) {
          newFills.push(newFill);
        }

        return newFills;
      });

      return id;
    },
    removeFill: (fill) => {
      setFills((fills) => {
        return fills.filter(f => f.id !== fill.id);
      });
    }
  });

  const slotContext = useRef({
    fills
  });

  return (
    <SlotContext.Provider value={ slotContext.current }>
      <FillContext.Provider value={ fillContext.current }>
        { children }
      </FillContext.Provider>
    </SlotContext.Provider>
  );
};
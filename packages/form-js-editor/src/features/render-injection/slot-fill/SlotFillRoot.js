import FillContext from './FillContext';
import SlotContext from './SlotContext';
import { useMemo, useState } from 'preact/hooks';

export default (props) => {
  const [ fills, setFills ] = useState([]);

  const fillContext = useMemo(() => ({
    addFill: (fill) => {
      setFills((fills) => [ ...fills.filter((f) => f.id !== fill.id), fill ]);
      props.onSetFill && props.onSetFill(fill);
    },
    removeFill: (id) => {
      setFills((fills) => fills.filter((f) => f.id !== id));
      props.onRemoveFill && props.onRemoveFill(id);
    }
  }), []);

  const slotContext = useMemo(() => ({ fills }), [ fills ]);

  return (
    <SlotContext.Provider value={ slotContext }>
      <FillContext.Provider /* @ts-expect-error */
        value={ fillContext }>
        { props.children }
      </FillContext.Provider>
    </SlotContext.Provider>
  );
};
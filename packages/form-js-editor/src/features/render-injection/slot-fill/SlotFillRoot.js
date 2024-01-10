import { FillContext } from './FillContext';
import { SlotContext } from './SlotContext';
import { useMemo, useState } from 'preact/hooks';

export const SlotFillRoot = (props) => {
  const [ fills, setFills ] = useState([]);

  const {
    onSetFill,
    onRemoveFill
  } = props;

  const fillContext = useMemo(() => ({
    addFill: (fill) => {
      setFills((fills) => [ ...fills.filter((f) => f.id !== fill.id), fill ]);
      onSetFill && onSetFill(fill);
    },
    removeFill: (id) => {
      setFills((fills) => fills.filter((f) => f.id !== id));
      onRemoveFill && onRemoveFill(id);
    }
  }), [ onRemoveFill, onSetFill ]);

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
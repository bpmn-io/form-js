import { FillContext } from './FillContext';
import { useContext, useEffect, useRef } from 'preact/compat';

export const Fill = (props) => {

  const uid = useRef(Symbol('fill_uid'));
  const fillContext = useContext(FillContext);

  useEffect(() => {

    if (!fillContext) {
      return;
    }

    fillContext.addFill({ id: uid, ...props });
    return () => {
      fillContext.removeFill(uid);
    };

  }, [ fillContext, props ]);

  return null;
};

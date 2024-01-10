import {
  useEffect
} from 'preact/hooks';

import {
  SelectEntry,
  usePrevious
} from '@bpmn-io/properties-panel';

import { useService } from '../hooks';


export function AutoFocusSelectEntry(props) {
  const {
    autoFocusEntry,
    element,
    getValue
  } = props;

  const value = getValue(element);
  const prevValue = usePrevious(value);

  const eventBus = useService('eventBus');

  // auto focus specifc other entry when selected value changed
  useEffect(() => {
    if (autoFocusEntry && prevValue && value !== prevValue) {

      // @Note(pinussilvestrus): There is an issue in the properties
      // panel so we have to wait a bit before showing the entry.
      // Cf. https://github.com/camunda/linting/blob/4f5328e2722f73ae60ae584c5f576eaec3999cb2/lib/modeler/Linting.js#L37
      setTimeout(() => {
        eventBus.fire('propertiesPanel.showEntry', {
          id: autoFocusEntry
        });
      });

    }
  }, [ value, autoFocusEntry, prevValue, eventBus ]);

  return (
    <SelectEntry { ...props } />
  );
}
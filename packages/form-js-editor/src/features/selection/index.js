import { Selection } from './Selection';
import { SelectionBehavior } from './SelectionBehavior';

export const SelectionModule = {
  __init__: [ 'selection', 'selectionBehavior' ],
  selection: [ 'type', Selection ],
  selectionBehavior: [ 'type', SelectionBehavior ]
};
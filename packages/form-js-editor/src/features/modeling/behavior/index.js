import { IdBehavior } from './IdBehavior';
import { KeyBehavior } from './KeyBehavior';
import { PathBehavior } from './PathBehavior';
import { ValidateBehavior } from './ValidateBehavior';
import { OptionsSourceBehavior } from './OptionsSourceBehavior';
import { ColumnsSourceBehavior } from './ColumnsSourceBehavior';
import { TableDataSourceBehavior } from './TableDataSourceBehavior';

export const BehaviorModule = {
  __init__: [
    'idBehavior',
    'keyBehavior',
    'pathBehavior',
    'validateBehavior',
    'optionsSourceBehavior',
    'columnsSourceBehavior',
    'tableDataSourceBehavior'
  ],
  idBehavior: [ 'type', IdBehavior ],
  keyBehavior: [ 'type', KeyBehavior ],
  pathBehavior: [ 'type', PathBehavior ],
  validateBehavior: [ 'type', ValidateBehavior ],
  optionsSourceBehavior: [ 'type', OptionsSourceBehavior ],
  columnsSourceBehavior: [ 'type', ColumnsSourceBehavior ],
  tableDataSourceBehavior: [ 'type', TableDataSourceBehavior ]
};

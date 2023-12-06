import IdBehavior from './IdBehavior';
import KeyBehavior from './KeyBehavior';
import PathBehavior from './PathBehavior';
import ValidateBehavior from './ValidateBehavior';
import ValuesSourceBehavior from './ValuesSourceBehavior';
import { ColumnsSourceBehavior } from './ColumnsSourceBehavior';
import { TableDataSourceBehavior } from './TableDataSourceBehavior';

export default {
  __init__: [
    'idBehavior',
    'keyBehavior',
    'pathBehavior',
    'validateBehavior',
    'valuesSourceBehavior',
    'columnsSourceBehavior',
    'tableDataSourceBehavior'
  ],
  idBehavior: [ 'type', IdBehavior ],
  keyBehavior: [ 'type', KeyBehavior ],
  pathBehavior: [ 'type', PathBehavior ],
  validateBehavior: [ 'type', ValidateBehavior ],
  valuesSourceBehavior: [ 'type', ValuesSourceBehavior ],
  columnsSourceBehavior: [ 'type', ColumnsSourceBehavior ],
  tableDataSourceBehavior: [ 'type', TableDataSourceBehavior ]
};
